const API_VERSION = 'v61.0';

const APEX_LOG_QUERY = (limit: number) => (
  'SELECT Id, LogUser.Name, Operation, Application, Status, LogLength, '
  + 'StartTime, Request, DurationMilliseconds '
  + `FROM ApexLog ORDER BY StartTime DESC LIMIT ${limit}`
);

interface ApexLogRecord {
  Id: string,
  LogUser?: { Name?: string | null } | null,
  Operation?: string | null,
  Application?: string | null,
  Status?: string | null,
  LogLength?: number | null,
  StartTime?: string | null,
  Request?: string | null,
  DurationMilliseconds?: number | null,
}

/** The my.salesforce.com host that owns the API session cookie for this org.
 *  Lightning, VF and setup domains all share the org's core domain session. */
const getApiHost = (domainName?: string | null, isSandbox?: boolean | null) => (
  domainName
    ? `${domainName}${isSandbox ? '.sandbox' : ''}.my.salesforce.com`
    : null
);

const getSessionId = async (apiHost: string) => {
  const cookie = await chrome.cookies.get({
    url: `https://${apiHost}`,
    name: 'sid',
  });
  return cookie?.value || null;
};

const apiRequest = async (
  apiHost: string,
  sid: string,
  path: string,
  accept = 'application/json',
  options?: {
    method?: string,
    body?: object,
  },
) => {
  const response = await fetch(`https://${apiHost}${path}`, {
    method: options?.method || 'GET',
    headers: {
      'Authorization': `Bearer ${sid}`,
      'Accept': accept,
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (response.status === 401) {
    throw new Error('Session expired or invalid (401). Reload the Salesforce tab and try again.');
  }
  if (!response.ok) {
    let detail = '';
    try {
      const errorBody = await response.json();
      detail = Array.isArray(errorBody)
        ? errorBody.map((e) => e.message).filter(Boolean).join('; ')
        : errorBody.message || '';
    } catch {
      // keep the generic message when the error body is not JSON
    }
    throw new Error(`Salesforce API returned HTTP ${response.status}${detail ? `: ${detail}` : ''}`);
  }
  return response;
};

const toolingQuery = async (
  apiHost: string,
  sid: string,
  soql: string,
) => {
  const response = await apiRequest(
    apiHost, sid,
    `/services/data/${API_VERSION}/tooling/query/?q=${encodeURIComponent(soql)}`,
  );
  const data = await response.json();
  return data.records || [];
};

const fetchApexLogs = async (
  apiHost: string,
  sid: string,
  limit = 30,
): Promise<ApexLogRecord[]> => (
  toolingQuery(apiHost, sid, APEX_LOG_QUERY(limit))
);

// Debug level required for KSX debugging, per "Capturing Debug Logs"
// (https://kantata.atlassian.net/wiki/spaces/SXS/pages/2821652511):
// Database Finest, Visualforce Finer, Apex Code Finest; the rest at Info for context.
const REQUIRED_DEBUG_LEVELS = {
  ApexCode: 'FINEST',
  Database: 'FINEST',
  Visualforce: 'FINER',
};

const KSX_DEBUG_LEVEL_NAME = 'KSX_Org_Tools';

interface DebugLevelRecord {
  Id: string,
  DeveloperName?: string | null,
  ApexCode?: string | null,
  Database?: string | null,
  Visualforce?: string | null,
}

interface TraceFlagRecord {
  Id: string,
  ExpirationDate?: string | null,
}

interface UserTraceResult {
  userName?: string | null,
  debugLevelName?: string | null,
  debugLevelCreated: boolean,
  traceExtended: boolean,
  expiration: Date,
}

/** SOQL datetime literal (unquoted, no milliseconds), e.g. 2026-08-20T15:04:05Z */
const toSoqlDatetime = (date: Date) => date.toISOString().replace(/\.\d{3}/, '');

const getCurrentUser = async (apiHost: string, sid: string) => {
  const response = await apiRequest(apiHost, sid, '/services/oauth2/userinfo');
  const data = await response.json();
  return {
    userId: data.user_id as string,
    userName: (data.name || null) as string | null,
  };
};

/** Find a debug level matching the required category levels; create (or repair
 *  a previously created) KSX one when the org has no match. */
const findOrCreateDebugLevel = async (apiHost: string, sid: string) => {
  const records: DebugLevelRecord[] = await toolingQuery(
    apiHost, sid,
    'SELECT Id, DeveloperName, ApexCode, Database, Visualforce FROM DebugLevel',
  );

  const match = records.find((level) => (
    level.ApexCode == REQUIRED_DEBUG_LEVELS.ApexCode
    && level.Database == REQUIRED_DEBUG_LEVELS.Database
    && level.Visualforce == REQUIRED_DEBUG_LEVELS.Visualforce
  ));
  if (match) {
    return { id: match.Id, name: match.DeveloperName, created: false };
  }

  // A KSX level may exist with drifted settings; reset it instead of
  // failing on the duplicate DeveloperName.
  const existingKsxLevel = records.find((level) => level.DeveloperName == KSX_DEBUG_LEVEL_NAME);
  if (existingKsxLevel) {
    await apiRequest(
      apiHost, sid,
      `/services/data/${API_VERSION}/tooling/sobjects/DebugLevel/${existingKsxLevel.Id}`,
      'application/json',
      { method: 'PATCH', body: REQUIRED_DEBUG_LEVELS },
    );
    return { id: existingKsxLevel.Id, name: KSX_DEBUG_LEVEL_NAME, created: false };
  }

  const response = await apiRequest(
    apiHost, sid,
    `/services/data/${API_VERSION}/tooling/sobjects/DebugLevel`,
    'application/json',
    {
      method: 'POST',
      body: {
        DeveloperName: KSX_DEBUG_LEVEL_NAME,
        MasterLabel: 'KSX Org Tools',
        ...REQUIRED_DEBUG_LEVELS,
        ApexProfiling: 'INFO',
        Callout: 'INFO',
        System: 'INFO',
        Validation: 'INFO',
        Workflow: 'INFO',
      },
    },
  );
  const data = await response.json();
  return { id: data.id as string, name: KSX_DEBUG_LEVEL_NAME, created: true };
};

/** Start a USER_DEBUG trace on the current session's user. Extends the
 *  existing trace flag when one is already active for that user. */
const startUserTrace = async (
  apiHost: string,
  sid: string,
  minutes = 10,
): Promise<UserTraceResult> => {
  const { userId, userName } = await getCurrentUser(apiHost, sid);
  const debugLevel = await findOrCreateDebugLevel(apiHost, sid);

  const now = new Date();
  const expiration = new Date(now.getTime() + minutes * 60 * 1000);

  const activeFlags: TraceFlagRecord[] = await toolingQuery(
    apiHost, sid,
    'SELECT Id, ExpirationDate FROM TraceFlag '
    + `WHERE TracedEntityId = '${userId}' AND LogType = 'USER_DEBUG' `
    + `AND ExpirationDate > ${toSoqlDatetime(now)}`,
  );

  if (activeFlags.length > 0) {
    // Overlapping trace flags for the same entity are not allowed; extend
    // the active one and point it at the required debug level instead.
    await apiRequest(
      apiHost, sid,
      `/services/data/${API_VERSION}/tooling/sobjects/TraceFlag/${activeFlags[0].Id}`,
      'application/json',
      {
        method: 'PATCH',
        body: {
          DebugLevelId: debugLevel.id,
          ExpirationDate: expiration.toISOString(),
        },
      },
    );
  } else {
    await apiRequest(
      apiHost, sid,
      `/services/data/${API_VERSION}/tooling/sobjects/TraceFlag`,
      'application/json',
      {
        method: 'POST',
        body: {
          TracedEntityId: userId,
          DebugLevelId: debugLevel.id,
          LogType: 'USER_DEBUG',
          StartDate: now.toISOString(),
          ExpirationDate: expiration.toISOString(),
        },
      },
    );
  }

  return {
    userName,
    debugLevelName: debugLevel.name,
    debugLevelCreated: debugLevel.created,
    traceExtended: activeFlags.length > 0,
    expiration,
  };
};

const safeFilenamePart = (text?: string | null) => (
  (text || 'unknown').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60)
);

const buildLogFilename = (log: ApexLogRecord) => {
  const start = log.StartTime ? new Date(log.StartTime) : null;
  const stamp = start && !isNaN(start.getTime())
    ? start.toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15)
    : 'unknown-time';
  return `${stamp}_${safeFilenamePart(log.Operation)}_${log.Id}.log`;
};

const downloadApexLog = async (
  apiHost: string,
  sid: string,
  log: ApexLogRecord,
) => {
  const response = await apiRequest(
    apiHost, sid,
    `/services/data/${API_VERSION}/tooling/sobjects/ApexLog/${log.Id}/Body`,
    'text/plain',
  );
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  try {
    await chrome.downloads.download({
      url,
      filename: `apex-logs/${buildLogFilename(log)}`,
      conflictAction: 'uniquify',
    });
  } finally {
    // Give the download manager a moment to claim the blob before revoking
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
};

/** Collect every ApexLog Id in the org, following query pagination. */
const fetchAllApexLogIds = async (apiHost: string, sid: string): Promise<string[]> => {
  const ids: string[] = [];
  let path: string | null = (
    `/services/data/${API_VERSION}/tooling/query/?q=${encodeURIComponent('SELECT Id FROM ApexLog')}`
  );
  while (path) {
    const response = await apiRequest(apiHost, sid, path);
    const data = await response.json();
    ids.push(...((data.records || []) as { Id: string }[]).map((record) => record.Id));
    path = data.done ? null : (data.nextRecordsUrl || null);
  }
  return ids;
};

const DELETE_CONCURRENCY = 5;

/** Delete every ApexLog in the org (all users). Deletes run a few at a time;
 *  onProgress is called after each successful delete. Returns the count deleted. */
const deleteAllApexLogs = async (
  apiHost: string,
  sid: string,
  onProgress?: (deleted: number, total: number) => void,
): Promise<number> => {
  const ids = await fetchAllApexLogIds(apiHost, sid);
  let deleted = 0;
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < ids.length) {
      const id = ids[nextIndex];
      nextIndex += 1;
      await apiRequest(
        apiHost, sid,
        `/services/data/${API_VERSION}/tooling/sobjects/ApexLog/${id}`,
        'application/json',
        { method: 'DELETE' },
      );
      deleted += 1;
      onProgress?.(deleted, ids.length);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(DELETE_CONCURRENCY, ids.length) }, worker),
  );
  return deleted;
};

const formatLogSize = (numBytes?: number | null) => {
  if (numBytes == null) return '?';
  if (numBytes >= 1024 * 1024) return `${(numBytes / (1024 * 1024)).toFixed(1)}M`;
  if (numBytes >= 1024) return `${Math.round(numBytes / 1024)}K`;
  return `${numBytes}B`;
};

export type { ApexLogRecord, UserTraceResult };
export {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  deleteAllApexLogs,
  formatLogSize,
  startUserTrace,
};
