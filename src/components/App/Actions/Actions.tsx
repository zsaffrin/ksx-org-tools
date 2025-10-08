import { useState } from 'react';
import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import './Actions.css';

const Actions = () => {
  const [targetRecordId, setTargetRecordId] = useState<string>('');
  const [objectSearchTerm, setObjectSearchTerm] = useState<string>('');
  const params = useUrlParams();

  const showRecordActions = !!params.recordId;

  const handleTargetRecordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRecordId(e.currentTarget.value);
  };
  const handleObjectSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectSearchTerm(e.currentTarget.value);
  };

  return (
    <div className="actions-layout">
      {showRecordActions && (
        <div>
          <button
            type='button'
            onClick={() => openNewPage(params.domain, `/${params.recordId}?nooverride=1`)}
          >
            Open Current Page with No-override
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
