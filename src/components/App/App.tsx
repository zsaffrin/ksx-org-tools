import useUrlParams from '../../hooks/useUrlParams';
import Debug from './Debug/Debug';
import './App.css';

const App = () => {
  const { isSalesforce } = useUrlParams();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      {
        isSalesforce ? [
          <Debug />,
        ] : (
          <div>
            Not a Salesforce URL
          </div>
        )
      }
    </div>
  );
};

export default App;
