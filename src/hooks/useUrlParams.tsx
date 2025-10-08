import { useEffect, useState } from 'react';

interface ChromeTabData {
  url?: string | null,
};

interface ParamData {
  url?: string | null,
  domain?: string | null,
  isSalesforce?: boolean | null,
  pageType?: string | null,
  sObject?: string | null,
  recordId?: string | null,
};

const getTabData = async () => {
  if (chrome && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length < 1) {
        return;
      }
      
      return tabs[0];
    });
  }

  return;
};

const getParamsFromUrl = (url?: string | null) => {
  const paramData: ParamData = {
    url,
  };
  
  if (url && url.length > 1) {
    const hasSalesforceTLD = url.includes('.force.com');
    if (hasSalesforceTLD) {
      paramData.isSalesforce = true;
    }

    const urlParts: string[] = url.split('/');
    paramData.domain = urlParts[2];
    paramData.pageType = urlParts[4];
    paramData.sObject = urlParts[5];
    paramData.recordId = urlParts[6];
  }

  return paramData;
};

const useUrlParams = () => {
  const [currentTabData, setCurrentTabData] = useState<ChromeTabData | void>({});
  const [paramData, setParamData] = useState<ParamData>({});

  useEffect(() => {
    if (!currentTabData?.url || currentTabData.url.length < 1) {
      refreshTabData();
    }
  }, [currentTabData]);

  const refreshTabData = () => {
    getTabData().then((tabData: ChromeTabData | void) => {
      setCurrentTabData(tabData);
      const params = getParamsFromUrl(currentTabData?.url);
      setParamData(params);
    });
    
  };
  
  return paramData;
};

export default useUrlParams;
