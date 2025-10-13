import Button from '../Button/Button';
import './RecordId.css';

interface RecordIdProps {
  recordId?: string | null,
  showOpenerActions?: boolean | null;
}

const RecordId = ({ recordId, showOpenerActions }: RecordIdProps) => {
  return (
    <div className='record-id-layout'>
      {recordId}
      {showOpenerActions && (
        <>
          <Button title='Open in New' />
          <Button title='Open no-override' />
        </>
      )}
    </div>
  );
};

export default RecordId;
