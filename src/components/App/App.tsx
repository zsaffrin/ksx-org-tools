import { useEffect, useState } from 'react';
import './App.css';
import Pages from './Pages/Pages';

const App = () => {
  const [val, setVal] = useState('');

  useEffect(() => {
    if (!val || val.length < 1) {
      refreshTabData();
    }
  }, [val]);

  const refreshTabData = async () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
        setVal(JSON.stringify(tab.url));
      });
    } else {
      setVal('ERROR: chrome.tabs unavailable');
    }
  };
  
  return (
    <div className="app-layout">
      <h1>KSX Org Tools</h1>
      <button type="button" onClick={refreshTabData}>refreshTabData</button>
      <div>{val}</div>
      <Pages />
    </div>
  );
};

export default App;
