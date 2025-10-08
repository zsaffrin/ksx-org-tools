import useTabData from '../../hooks/useTabData';
import Debug from './Debug/Debug';
import Actions from './Actions/Actions';
import Pages from './Pages/Pages';
import './App.css';

const App = () => {
  const { isSalesforce } = useTabData();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      {
        isSalesforce ? [
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
