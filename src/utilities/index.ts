import isSalesforceRecordId from './isSalesforceRecordId';
import {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
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
  formatLogSize,
  startUserTrace,
};
export type { ApexLogRecord, UserTraceResult };
