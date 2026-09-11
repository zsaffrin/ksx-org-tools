import { useState } from 'react';
import { useUrlParams } from '../../../hooks';
import { Button } from '../../ui';
import {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  deleteAllApexLogs,
  formatLogSize,
  startUserTrace,
} from '../../../utilities';
import type { ApexLogRecord } from '../../../utilities';
import './ApexLogs.css';

const ApexLogs = () => {
  const params = useUrlParams();
  const [logs, setLogs] = useState<ApexLogRecord[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState<boolean>(false);

  const apiHost = getApiHost(params.domainName, params.isSandbox);

  const withSession = async (fn: (host: string, sid: string) => Promise<void>) => {
    if (!apiHost) {
      setStatus('Could not determine the org API domain from this tab.');
      return;
    }
    setIsBusy(true);
    setStatus(null);
    try {
      const sid = await getSessionId(apiHost);
      if (!sid) {
        setStatus(`No Salesforce session found for ${apiHost}. Open the org in this tab first.`);
        return;
      }
      await fn(apiHost, sid);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBusy(false);
    }
  };

  const startTrace = () => withSession(async (host, sid) => {
    const result = await startUserTrace(host, sid, 10);
    const until = result.expiration.toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit',
    });
    const parts = [
      `Trace ${result.traceExtended ? 'extended' : 'active'} on `
      + `${result.userName || 'current user'} until ${until}`,
    ];
    if (result.debugLevelName) {
      parts.push(`using debug level ${result.debugLevelName}`
        + (result.debugLevelCreated ? ' (created)' : ''));
    }
    setStatus(`${parts.join(', ')}.`);
  });

  const loadLogs = () => withSession(async (host, sid) => {
    const records = await fetchApexLogs(host, sid);
    setLogs(records);
    setSelectedIds(new Set());
    if (records.length < 1) {
      setStatus('No debug logs found. Check that a trace flag is active for the user.');
    }
  });

  const downloadSelected = () => withSession(async (host, sid) => {
    const selected = (logs || []).filter((log) => selectedIds.has(log.Id));
    for (const log of selected) {
      await downloadApexLog(host, sid, log);
    }
    setStatus(`Saved ${selected.length} log${selected.length === 1 ? '' : 's'} to Downloads/apex-logs.`);
  });

  const deleteAll = () => {
    setConfirmDeleteAll(false);
    return withSession(async (host, sid) => {
      setStatus('Deleting logs\u2026');
      const count = await deleteAllApexLogs(host, sid, (deleted, total) => {
        setStatus(`Deleting logs\u2026 ${deleted} of ${total}`);
      });
      if (logs) {
        setLogs([]);
        setSelectedIds(new Set());
      }
      setStatus(count > 0
        ? `Deleted ${count} log${count === 1 ? '' : 's'} from the org.`
        : 'No debug logs to delete.');
    });
  };

  const toggleLog = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (logs && selectedIds.size < logs.length) {
      setSelectedIds(new Set(logs.map((log) => log.Id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const formatStart = (value?: string | null) => {
    if (!value) return '?';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '?';
    return date.toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className='section-title'>Apex Debug Logs</div>
      <div className='apex-logs-controls'>
        <Button
          title='Trace Me (10 min)'
          action={() => { if (!isBusy) startTrace(); }}
        />
        <Button
          title={logs ? 'Refresh' : 'Load Logs'}
          action={() => { if (!isBusy) loadLogs(); }}
        />
        {logs && logs.length > 0 && (
          <Button
            title={`Download Selected (${selectedIds.size})`}
            action={() => { if (!isBusy && selectedIds.size > 0) downloadSelected(); }}
          />
        )}
        {confirmDeleteAll ? (
          <>
            <Button
              title='Confirm: Delete All'
              action={() => { if (!isBusy) deleteAll(); }}
            />
            <Button
              title='Cancel'
              action={() => setConfirmDeleteAll(false)}
            />
          </>
        ) : (
          <Button
            title='Delete All Logs'
            action={() => { if (!isBusy) setConfirmDeleteAll(true); }}
          />
        )}
      </div>
      {confirmDeleteAll && (
        <div className='apex-logs-status'>
          This deletes every Apex debug log in the org, for all users. Continue?
        </div>
      )}
      {status && <div className='apex-logs-status'>{status}</div>}
      {logs && logs.length > 0 && (
        <table className='apex-logs-table'>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={selectedIds.size === logs.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Start</th>
              <th>User</th>
              <th>Operation</th>
              <th>Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.Id} onClick={() => toggleLog(log.Id)}>
                <td>
                  <input
                    type='checkbox'
                    checked={selectedIds.has(log.Id)}
                    onChange={() => toggleLog(log.Id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{formatStart(log.StartTime)}</td>
                <td>{log.LogUser?.Name || '?'}</td>
                <td className='apex-logs-operation' title={log.Operation || ''}>
                  {log.Operation || '?'}
                </td>
                <td>{formatLogSize(log.LogLength)}</td>
                <td className='apex-logs-operation' title={log.Status || ''}>
                  {log.Status || '?'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApexLogs;
