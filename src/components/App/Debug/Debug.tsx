import useUrlParams from '../../../hooks/useUrlParams';
import './Debug.css';

const Debug = () => {
  const params = useUrlParams();

  return (
    <div className="debug-layout">
      <h2>Debug</h2>
      <div className="codeblock">
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Debug;
