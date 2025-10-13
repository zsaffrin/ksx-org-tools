import { useState } from 'react';
import { useNav, useUrlParams } from '../../../hooks';
import { Button } from '../../ui';
import ContextActions from './ContextActions';
import './Actions.css';

const Actions = () => {
  const [targetRecordId, setTargetRecordId] = useState<string>('');
  const [objectSearchTerm, setObjectSearchTerm] = useState<string>('');
  const params = useUrlParams();
  const { openNew } = useNav();

  const handleTargetRecordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetRecordId(e.currentTarget.value);
  };
  const handleObjectSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectSearchTerm(e.currentTarget.value);
  };

  return (
    <div className="actions-layout">
      <ContextActions params={params} />
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
        <Button
          title='Open'
          action={() => openNew(`lightning/_classic/${targetRecordId}`)}
        />
        <Button
          title='Open w/No-override'
          action={() => openNew(`lightning/_classic/${targetRecordId}`, { nooverride: true })}
        />
      </div>
      <div className="record-opener">
        <input
          id='objectSearchTerm'
          type='text'
          value={objectSearchTerm}
          onChange={handleObjectSearchTermChange}
        />
        <Button
          title='Search ObjectLinks'
          action={() => openNew('apex/KimbleOne__ObjectLinks', { f: objectSearchTerm })}
        />
      </div>
    </div>
  );
};

export default Actions;
