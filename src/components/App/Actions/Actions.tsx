import { useState } from 'react';
import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import './Actions.css';

const Actions = () => {
  const [targetRecordId, setTargetRecordId] = useState<string>('');
  const params = useUrlParams();

  const showRecordActions = !!params.recordId;

  const handleTargetRecordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRecordId(e.currentTarget.value);
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
          ID
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
    </div>
  );
};

export default Actions;
