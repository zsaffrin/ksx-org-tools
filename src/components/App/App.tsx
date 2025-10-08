// import useUrlParams from '../../hooks/useUrlParams';
import Info from './Info/Info';
import Actions from './Actions/Actions';
import Debug from './Debug/Debug';
import './App.css';

const App = () => {
  // const { isSalesforce } = useUrlParams();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      <Info />
      <Actions />
      <Debug />
    </div>
  );
};

export default App;
