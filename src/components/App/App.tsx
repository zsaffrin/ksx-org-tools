import useTabData from '../../hooks/useTabData';
import Debug from './Debug/Debug';
import Actions from './Actions/Actions';
import Pages from './Pages/Pages';
import './App.css';

const App = () => {
  const { isSalesforceDomain } = useTabData();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      {
        isSalesforceDomain ? [
          <Debug />,
          <Actions />,
          <Pages />,
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
