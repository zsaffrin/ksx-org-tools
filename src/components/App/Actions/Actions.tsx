import useUrlParams from '../../../hooks/useUrlParams';
import { openNewPage } from '../../../utilities';
import './Actions.css';

const Actions = () => {
  const params = useUrlParams();

  const showRecordActions = !!params.recordId;

  return (
    <div className="actions-layout">
      {showRecordActions && (
        <button
          type='button'
          onClick={() => openNewPage(params.domain, `/${params.recordId}?nooverride=1`)}
        >
          Open Current Page with No-override
        </button>
      )}
    </div>
  );
};

export default Actions;
