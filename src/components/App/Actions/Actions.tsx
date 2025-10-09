import { useState } from 'react';
import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage, redirectPage } from '../../../utilities';
import './Actions.css';

const Actions = () => {
  const [targetRecordId, setTargetRecordId] = useState<string>('');
  const [objectSearchTerm, setObjectSearchTerm] = useState<string>('');
  const params = useUrlParams();

  const handleTargetRecordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRecordId(e.currentTarget.value);
  };
  const handleObjectSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectSearchTerm(e.currentTarget.value);
  };

  const constructThreadsTargetString = () => {
    const joiner = params.apexArgs
      ? '&'
      : '?';
    return `${params.url}` + joiner + 'threads=10';
  };

  return (
    <div className="actions-layout">
      {params.recordId && (
        <div className="two-column-grid">
          <button
            type='button'
            onClick={() => openNewPage(params.domain, `/${params.recordId}`)}
          >
            Open Current Record
          </button>
          <button
            type='button'
            onClick={() => openNewPage(params.domain, `/${params.recordId}?nooverride=1`)}
          >
            {'Open Current Record w/No-override'}
          </button>
        </div>
      )}
      {params.apexPage == 'JobsPending' && (
        <div>
          <button
            type='button'
            onClick={() => redirectPage(constructThreadsTargetString())}
          >
            threads=10
          </button>
        </div>
      )}
      {params.sObject == 'KimbleOne__ActivityAssignment__c' && params.recordId && (
        <div>
          <button
            type='button'
            onClick={() => openNewPage(params.domain, `/apex/KimbleOne__ActivityAssignmentRates?id=${params.recordId}`)}
          >
            Open Assignment Usage Pattern
          </button>
        </div>
      )}
      <div className="record-opener">
        <div className="record-opener-label">
          Record Id
        </div>
        <input
          id='targetRecordId'
          type='text'
          value={targetRecordId}
          onChange={handleTargetRecordIdChange}
        />
        <button
          type='button'
          onClick={() => openNewPage(params.domain, `/${targetRecordId}`)}
        >
          Open
        </button>
        <button
          type='button'
          onClick={() => openNewPage(params.domain, `/${targetRecordId}?nooverride=1`)}
        >
          Open w/No-override
        </button>
      </div>
      <div className="record-opener">
        <input
          id='objectSearchTerm'
          type='text'
          value={objectSearchTerm}
          onChange={handleObjectSearchTermChange}
        />
        <button
          type='button'
          onClick={() => openNewPage(params.domain, `/apex/KimbleOne__ObjectLinks?f=${objectSearchTerm}`)}
        >
          Search ObjectLinks
        </button>
      </div>
    </div>
  );
};

export default Actions;
