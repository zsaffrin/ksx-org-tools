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
<<<<<<< HEAD
      <button type="button" onClick={refreshTabData}>refreshTabData</button>
      <div>{val}</div>
      <Pages />
=======
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
>>>>>>> 84ebd8c (Get URL extraction working)
    </div>
  );
};

export default App;
