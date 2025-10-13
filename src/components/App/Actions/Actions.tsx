import { useState } from 'react';
import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import { Button } from '../../ui';
import ContextActions from './ContextActions';
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

  return (
    <div className="actions-layout">
      <ContextActions params={params} />
      {params.sObject == 'KimbleOne__ActivityAssignment__c' && params.recordId && (
        <div>
          <Button
            title='Open Assignment Usage Pattern'
            action={() => openNewPage(params.domain, `/apex/KimbleOne__ActivityAssignmentRates?id=${params.recordId}`)}
          />
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
        <Button
          title='Open'
          action={() => openNewPage(params.domain, `/${targetRecordId}`)}
        />
        <Button
          title='Open w/No-override'
          action={() => openNewPage(params.domain, `/${targetRecordId}?nooverride=1`)}
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
          action={() => openNewPage(params.domain, `/apex/KimbleOne__ObjectLinks?f=${objectSearchTerm}`)}
        />
      </div>
    </div>
  );
};

export default Actions;
