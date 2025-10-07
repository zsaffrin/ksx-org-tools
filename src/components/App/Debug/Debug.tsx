import useTabData from '../../../hooks/useTabData';
import './Debug.css';

const Debug = () => {
  const tabData = useTabData();

  return (
    <div className="debug-layout">
      <h2>Debug</h2>
      <div className="codeblock">
        {JSON.stringify(tabData)}
      </div>
    </div>
  );
};

export default Debug;
