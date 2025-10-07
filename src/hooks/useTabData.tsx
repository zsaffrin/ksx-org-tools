import { useEffect, useState } from 'react';

interface TabData {
  url?: string,
  domain?: string,
  isSalesforceDomain: boolean,
}

const defaultTabData: TabData = {
  isSalesforceDomain: false,
};

const useTabData = () => {
  const [tabData, setTabData] = useState<TabData>(defaultTabData);

  useEffect(() => {
    if (!tabData.url || tabData.url.length < 1) {
      refreshTabData();
    }
  }, [tabData]);

  const isSalesforceUrl = (url: string = '') => {
    const hasSalesforceTLD = url.includes('.force.com');

    if (hasSalesforceTLD) {
      return true;
    }

    return false;
  };

  const extractInfoFromUrl = (url: string) => {
    const pageInfo = {
      domain: null,
      pageType: null,
      sObject: null,
      recordId: null,
      isSalesforce: false,
    };

    if (url && url.length > 0) {
      pageInfo.domain = url.split('/')[2];
      
      const typeParam = url.split('/');

      if (isSalesforceUrl(url)) {
        pageInfo.isSalesforce = true;
      }
    }

    return pageInfo;
  };

  const refreshTabData = async () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length < 1) {
          return;
        }
        
        const tabData = tabs[0];
        const url = tabData.url;
        const domain = url?.split('/')[2];
        
        const currentTab: TabData = {
          url,
        };
        setTabData(currentTab);
      });
    }
  };
  
  return (tabData);
};

export default useTabData;
