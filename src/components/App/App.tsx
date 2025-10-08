// import useUrlParams from '../../hooks/useUrlParams';
import Info from './Info/Info';
import Debug from './Debug/Debug';
import './App.css';

const App = () => {
  // const { isSalesforce } = useUrlParams();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      <Info />
      <Debug />
    </div>
  );
};

export default App;
