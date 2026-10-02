import { useState } from 'react';
import { useUrlParams } from '../../../hooks';
import { Button } from '../../ui';
import {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  deleteApexLogs,
  deleteAllApexLogs,
  formatLogSize,
  startUserTrace,
} from '../../../utilities';
import type { ApexLogRecord } from '../../../utilities';
import './ApexLogs.css';

const PAGE_SIZE = 25;

const ApexLogs = () => {
  const params = useUrlParams();
  const [logs, setLogs] = useState<ApexLogRecord[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<'all' | 'selected' | null>(null);
  const [page, setPage] = useState<number>(0);

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
    setPage(0);
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

  const deleteSelected = () => {
    setConfirmDelete(null);
    const ids = Array.from(selectedIds);
    return withSession(async (host, sid) => {
      setStatus('Deleting logs\u2026');
      const count = await deleteApexLogs(host, sid, ids, (deleted, total) => {
        setStatus(`Deleting logs\u2026 ${deleted} of ${total}`);
      });
      setLogs((logs || []).filter((log) => !selectedIds.has(log.Id)));
      setSelectedIds(new Set());
      setStatus(`Deleted ${count} log${count === 1 ? '' : 's'} from the org.`);
    });
  };

  const deleteAll = () => {
    setConfirmDelete(null);
    return withSession(async (host, sid) => {
      setStatus('Deleting logs\u2026');
      const count = await deleteAllApexLogs(host, sid, (deleted, total) => {
        setStatus(`Deleting logs\u2026 ${deleted} of ${total}`);
      });
      if (logs) {
        setLogs([]);
        setSelectedIds(new Set());
        setPage(0);
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
    setConfirmDelete(null);
  };

  const pageCount = Math.max(1, Math.ceil((logs?.length || 0) / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageLogs = (logs || []).slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const pageAllSelected = pageLogs.length > 0 && pageLogs.every((log) => selectedIds.has(log.Id));

  /** Header checkbox selects or clears the logs on the current page only. */
  const togglePage = () => {
    const next = new Set(selectedIds);
    for (const log of pageLogs) {
      if (pageAllSelected) {
        next.delete(log.Id);
      } else {
        next.add(log.Id);
      }
    }
    setSelectedIds(next);
    setConfirmDelete(null);
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
        {confirmDelete ? (
          <>
            <Button
              title={confirmDelete == 'selected'
                ? `Confirm: Delete Selected (${selectedIds.size})`
                : 'Confirm: Delete All'}
              action={() => {
                if (isBusy) return;
                if (confirmDelete == 'selected') {
                  deleteSelected();
                } else {
                  deleteAll();
                }
              }}
            />
            <Button
              title='Cancel'
              action={() => setConfirmDelete(null)}
            />
          </>
        ) : (
          <Button
            title={selectedIds.size > 0 ? `Delete Selected (${selectedIds.size})` : 'Delete All Logs'}
            action={() => {
              if (!isBusy) setConfirmDelete(selectedIds.size > 0 ? 'selected' : 'all');
            }}
          />
        )}
      </div>
      {confirmDelete && (
        <div className='apex-logs-status'>
          {confirmDelete == 'selected'
            ? `This deletes the ${selectedIds.size} selected log${selectedIds.size === 1 ? '' : 's'} from the org. Continue?`
            : 'This deletes every Apex debug log in the org, for all users. Continue?'}
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
                  checked={pageAllSelected}
                  onChange={togglePage}
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
            {pageLogs.map((log) => (
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
      {logs && logs.length > 0 && (
        <div className='apex-logs-pager'>
          <Button
            size='small'
            title='Prev'
            action={() => { if (currentPage > 0) setPage(currentPage - 1); }}
          />
          <span>
            Page {currentPage + 1} of {pageCount}
            {' \u00b7 '}
            {currentPage * PAGE_SIZE + 1}\u2013{currentPage * PAGE_SIZE + pageLogs.length} of {logs.length} logs
          </span>
          <Button
            size='small'
            title='Next'
            action={() => { if (currentPage < pageCount - 1) setPage(currentPage + 1); }}
          />
        </div>
      )}
    </div>
  );
};

export default ApexLogs;
