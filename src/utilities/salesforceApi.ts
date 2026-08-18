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
) => {
  const response = await fetch(`https://${apiHost}${path}`, {
    headers: {
      'Authorization': `Bearer ${sid}`,
      'Accept': accept,
    },
  });
  if (response.status === 401) {
    throw new Error('Session expired or invalid (401). Reload the Salesforce tab and try again.');
  }
  if (!response.ok) {
    throw new Error(`Salesforce API returned HTTP ${response.status}`);
  }
  return response;
};

const fetchApexLogs = async (
  apiHost: string,
  sid: string,
  limit = 30,
): Promise<ApexLogRecord[]> => {
  const query = encodeURIComponent(APEX_LOG_QUERY(limit));
  const response = await apiRequest(
    apiHost, sid,
    `/services/data/${API_VERSION}/tooling/query/?q=${query}`,
  );
  const data = await response.json();
  return data.records || [];
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

const formatLogSize = (numBytes?: number | null) => {
  if (numBytes == null) return '?';
  if (numBytes >= 1024 * 1024) return `${(numBytes / (1024 * 1024)).toFixed(1)}M`;
  if (numBytes >= 1024) return `${Math.round(numBytes / 1024)}K`;
  return `${numBytes}B`;
};

export type { ApexLogRecord };
export {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  formatLogSize,
};
