import { useEffect, useState } from 'react';

interface TabData {
  url?: string | null,
  domain?: string | null,
  pageType?: string | null,
  sObject?: string | null,
  recordId?: string | null,
  isSalesforce?: boolean | null,
}

const defaultTabData: TabData = {
  isSalesforce: false,
};

const useTabData = () => {
  const [tabData, setTabData] = useState<TabData>(defaultTabData);

  useEffect(() => {
    if (!tabData.url || tabData.url.length < 1) {
      refreshTabData();
    }
  }, [tabData]);

  const isSalesforceUrl = (url: string) => {
    if (url) {
      const hasSalesforceTLD = url.includes('.force.com');
  
      if (hasSalesforceTLD) {
        return true;
      }
    }

    return false;
  };

  const extractInfoFromUrl = (url: string | null) => {
    const pageInfo: TabData = {
      domain: null,
      pageType: null,
      sObject: null,
      recordId: null,
      isSalesforce: false,
    };

    if (url && url.length > 0) {
      const splitUrl: string[] = url.split('/');
      
      pageInfo.domain = splitUrl[2];
      
      const typeParam = splitUrl[4];

      switch (typeParam) {
        case 'o':
          pageInfo.pageType = 'object';
          break;
        case 'r':
          pageInfo.pageType = 'record';
          break;
      }

      if (pageInfo.pageType) {
        pageInfo.sObject = splitUrl[5];

        if (pageInfo.pageType == 'r') {
          pageInfo.recordId = splitUrl[6];
        }
      }

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
        const url = tabData.url || null;
        const pageInfo = extractInfoFromUrl(url);
        
        const currentTab: TabData = {
          url,
          ...pageInfo,
        };
        setTabData(currentTab);
      });
    }
  };
  
  return (tabData);
};

export default useTabData;
