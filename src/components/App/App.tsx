import { useUrlParams } from '../../hooks';
import Info from './Info/Info';
import Actions from './Actions/Actions';
import Pages from './Pages/Pages';
import Footer from './Footer/Footer';
// import Debug from './Debug/Debug';
import './App.css';

const App = () => {
  const { isSupportedDomain } = useUrlParams();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      {isSupportedDomain ? (
        <>
          <Info />
          <Actions />
          <Pages />
        </>
      ) : (
        <div>Unsupported domain. You are probably not in a Salesforce org.</div>
      )}
      {/* <Debug /> */}
      <Footer />
    </div>
  );
};

export default App;
