import isSalesforceRecordId from './isSalesforceRecordId';
import {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  deleteAllApexLogs,
  formatLogSize,
  startUserTrace,
} from './salesforceApi';
import type { ApexLogRecord, UserTraceResult } from './salesforceApi';

export {
  isSalesforceRecordId,
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  deleteAllApexLogs,
  formatLogSize,
  startUserTrace,
};
export type { ApexLogRecord, UserTraceResult };
