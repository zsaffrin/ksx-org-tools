import useTabData from '../../../hooks/useTabData';
import './Debug.css';

const Debug = () => {
  const tabData = useTabData();

  return (
    <div className="debug-layout">
      <h2>Debug</h2>
      <div className="codeblock">
        <pre>{JSON.stringify(tabData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Debug;
