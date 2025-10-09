import useUrlParams from '../../hooks/useUrlParams';
import Info from './Info/Info';
import Actions from './Actions/Actions';
import Pages from './Pages/Pages';
import Footer from './Footer/Footer';
// import Debug from './Debug/Debug';
import './App.css';

const App = () => {
  const { isSalesforce } = useUrlParams();
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      {isSalesforce ? (
        <>
          <Info />
          <Actions />
          <Pages />
        </>
      ) : (
        <div>Not a Salesforce org url</div>
      )}
      {/* <Debug /> */}
      <Footer />
    </div>
  );
};

export default App;
