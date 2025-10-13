import useUrlParams from '../../../hooks/useUrlParams';
import Button from '../Button/Button';
import { isSalesforceRecordId, openNewPage } from '../../../utilities';
import './RecordId.css';

interface RecordIdProps {
  recordId?: string | null,
  showOpenerActions?: boolean;
}

const RecordId = ({ recordId, showOpenerActions = true }: RecordIdProps) => {
  const params = useUrlParams();
  
  return (
    <div className='record-id-layout'>
      {recordId}
      {isSalesforceRecordId(recordId || null) && showOpenerActions && (
        <>
          <Button
            size='small'
            title='Open in New'
            action={() => openNewPage(params.domain, `/${recordId}`)}
          />
          <Button
            size='small'
            title='Open w/ no-override'
            action={() => openNewPage(params.domain, `/${recordId}?nooverride=1`)}
          />
        </>
      )}
    </div>
  );
};

export default RecordId;
