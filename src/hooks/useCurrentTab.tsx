import { useEffect, useState } from 'react';

interface ChromeTabData {
  id?: number | null,
  url?: string | null,
};

const useCurrentTab = () => {
  const [currentTabData, setCurrentTabData] = useState<ChromeTabData>({});
  
  useEffect(() => {
    if (!currentTabData?.url || currentTabData.url.length < 1) {
      refreshTabData();
    }
  }, [currentTabData]);

  const refreshTabData = async () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length < 1) {
          return;
        }
        
        const tabData = tabs[0];
        setCurrentTabData(tabData);
      });
    }
  };
  
  return currentTabData;
};

export default useCurrentTab;
