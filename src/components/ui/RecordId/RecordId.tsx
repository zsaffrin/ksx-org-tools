import Button from '../Button/Button';
import { isSalesforceRecordId } from '../../../utilities';
import { useNav } from '../../../hooks';
import './RecordId.css';

interface RecordIdProps {
  recordId?: string | null,
  sObject?: string | null,
  showOpenerActions?: boolean;
}

const RecordId = ({ recordId, sObject, showOpenerActions = true }: RecordIdProps) => {
  const { navigate } = useNav();

  const isSalesforceId = isSalesforceRecordId(recordId || null);

  const showActions = isSalesforceId && showOpenerActions;
  
  return (
    <div className='record-id-layout'>
      {recordId}
      {showActions && (
        <>
          <Button
            size='small'
            title='Open in New'
            action={() => navigate({ type: 'record', recordId, sObject })}
            />
          <Button
            size='small'
            title='Open w/ no-override'
            action={() => navigate({ type: 'record', recordId, sObject }, { nooverride: true })}
          />
        </>
      )}
    </div>
  );
};

export default RecordId;
