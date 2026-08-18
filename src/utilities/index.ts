import isSalesforceRecordId from './isSalesforceRecordId';
import {
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  formatLogSize,
} from './salesforceApi';
import type { ApexLogRecord } from './salesforceApi';

export {
  isSalesforceRecordId,
  getApiHost,
  getSessionId,
  fetchApexLogs,
  downloadApexLog,
  formatLogSize,
};
export type { ApexLogRecord };
