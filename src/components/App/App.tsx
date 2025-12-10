import { AppStateProvider } from '../../contexts';
import { useUrlParams } from '../../hooks';
import Header from './Header/Header';
import Info from './Info/Info';
import Actions from './Actions/Actions';
import Pages from './Pages/Pages';
import Footer from './Footer/Footer';
import './App.css';

const App = () => {
  const { isSupportedDomain } = useUrlParams();
  
  return (
    <AppStateProvider>
      <div className="app-layout">
        <Header />
        {isSupportedDomain ? (
          <>
            <Info />
            <Actions />
            <Pages />
          </>
        ) : (
          <div>Unsupported domain. You are probably not in a Salesforce org.</div>
        )}
        <Footer />
      </div>
    </AppStateProvider>
  );
};

export default App;
