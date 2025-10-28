import { useState } from 'react';
import { useNav, useUrlParams } from '../../../hooks';
import { Button } from '../../ui';
import ContextActions from './ContextActions';
import './Actions.css';

const Actions = () => {
  const [targetRecordId, setTargetRecordId] = useState<string>('');
  const [objectSearchTerm, setObjectSearchTerm] = useState<string>('');
  const params = useUrlParams();
  const { navigate } = useNav();

  const handleTargetRecordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRecordId(e.currentTarget.value);
  };
  const handleObjectSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectSearchTerm(e.currentTarget.value);
  };

  return (
    <div className="actions-layout">
      <ContextActions params={params} />
      <div className='two-column-grid'>
        <div className="record-opener left">
          <div className="record-opener-label">
            Record Id
          </div>
          <input
            id='targetRecordId'
            type='text'
            value={targetRecordId}
            onChange={handleTargetRecordIdChange}
          />
        </div>
        <div className="record-opener">
          <Button
            title='Open'
            action={() => navigate({ type: 'record', recordId: targetRecordId })}
            />
          <Button
            title='Open w/ no-override'
            action={() => navigate({ type: 'record', recordId: targetRecordId }, { nooverride: true })}
          />
        </div>
        <div className="record-opener left">
          <div className="record-opener-label">
            Search
          </div>
          <input
            id='objectSearchTerm'
            type='text'
            value={objectSearchTerm}
            onChange={handleObjectSearchTermChange}
          />
        </div>
        <div className="record-opener">
          <Button
            title='Search ObjectLinks'
            action={() => navigate({ type: 'apex', page: 'KimbleOne__ObjectLinks' }, { f: objectSearchTerm })}
          />
        </div>
      </div>
    </div>
  );
};

export default Actions;
