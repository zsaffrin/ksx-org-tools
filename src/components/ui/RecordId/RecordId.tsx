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
  const { openNew } = useNav();

  const isSalesforceId = isSalesforceRecordId(recordId || null);

  const showActions = isSalesforceId && showOpenerActions;

  const urlPath = sObject 
    ? `lightning/r/${sObject}/${recordId}/view`
    : `lightning/_classic/${recordId}`;
  
  return (
    <div className='record-id-layout'>
      {recordId}
      {showActions && (
        <>
          <Button
            size='small'
            title='Open in New'
            action={() => openNew(urlPath)}
          />
          <Button
            size='small'
            title='Open w/ no-override'
            action={() => openNew(urlPath, { nooverride: true })}
          />
        </>
      )}
    </div>
  );
};

export default RecordId;
