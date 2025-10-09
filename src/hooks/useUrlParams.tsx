import { useEffect, useState } from 'react';

interface ChromeTabData {
  url?: string | null,
};

interface OneUrlBlobData {
  componentDef?: string | null,
  attributes?: {
    address?: string | null,
  } | null,
  state?: string | null,
}

interface ApexArgs {
  [key: string]: string | null,
}

interface ParamData {
  url?: string | null,
  domain?: string | null,
  isSalesforce?: boolean | null,
  pageType?: string | null,
  sObject?: string | null,
  recordId?: string | null,
  oneBlob?: string | null,
  oneBlobDecoded?: OneUrlBlobData | null,
  apexPage?: string | null,
  apexArgs?: ApexArgs | null,
};

const getParamsFromUrl = (url?: string | null) => {
  const paramData: ParamData = {
    url,
    isSalesforce: false,
    pageType: 'unknown',
  };
  
  if (url && url.length > 1) {
    const hasSalesforceTLD = url.includes('.force.com');
    if (hasSalesforceTLD) {
      paramData.isSalesforce = true;
    }

    const urlParts: string[] = url.split('/');
    paramData.domain = urlParts[2];
    if (urlParts[3] == 'lightning') {
      if (urlParts[4] == 'o') {
        paramData.pageType = 'object';
        paramData.sObject = urlParts[5];
      }
      if (urlParts[4] == 'r') {
        paramData.pageType = 'record';
        paramData.recordId = urlParts[6];
        paramData.sObject = urlParts[5];
      }
      if (urlParts[4] == 'setup') {
        paramData.pageType = 'setup';
      }
    }
    if (urlParts[3] == 'one') {
      const oneBlobParts = urlParts[4].split('#');
      paramData.oneBlob = oneBlobParts[1];
      paramData.oneBlobDecoded = JSON.parse(atob(decodeURIComponent(oneBlobParts[1])));

      if (paramData.oneBlobDecoded?.attributes?.address) {
        const oneAddressParts = paramData.oneBlobDecoded.attributes.address.split('/');
        if (oneAddressParts[3] == 'apex') {
          paramData.pageType = 'apex';
          const apexParts = oneAddressParts[4].split('?');
          paramData.apexPage = apexParts[0];
          paramData.apexArgs = apexParts[1]?.split('&').reduce<ApexArgs>((acc, arg) => {
            const argParts = arg.split('=');
            return ({
              ...acc,
              [argParts[0]]: argParts[1],
            });
          }, {});
          if (paramData.apexArgs?.id) {
            paramData.recordId = paramData.apexArgs.id;
          }
        }
      }
    }
    if (urlParts[3] == 'apex') {
      paramData.pageType = 'apex';
      const apexParts = urlParts[4].split('?');
      paramData.apexPage = apexParts[0];
      paramData.apexArgs = apexParts[1]?.split('&').reduce<ApexArgs>((acc, arg) => {
        const argParts = arg.split('=');
        return ({
          ...acc,
          [argParts[0]]: argParts[1],
        });
      }, {});
      if (paramData.apexArgs?.id) {
        paramData.recordId = paramData.apexArgs.id;
      }
    }
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

  const refreshTabData = async () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length < 1) {
          return;
        }
        
        const tabData = tabs[0];
        setCurrentTabData(tabData);

        const params = getParamsFromUrl(tabData?.url);
        setParamData(params);
      });
    }
  };
  
  return paramData;
};

export default useUrlParams;
