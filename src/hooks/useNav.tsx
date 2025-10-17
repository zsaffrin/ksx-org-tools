import useUrlParams from './useUrlParams';

interface UrlArgs {
  [key: number | string]: number | string | boolean | null
}
interface NavigateTargetData {
  type?: string | null,
  recordId?: string | null,
  sObject?: string | null,
  page?: string | null,
  target?: string | null,
  redirect?: boolean | null,
  external?: boolean | null,
  maintainUrl?: boolean | null,
}

const argObjToUrlString = (argObject?: UrlArgs | null) => (
  argObject
    ? Object.keys(argObject).reduce((acc, argKey) => ([
      ...acc,
      `${argKey}=${argObject[argKey]}`
    ]), [] as string[]).join('&')
    : null
);

const useNav = () => {
  const params = useUrlParams();

  const navigate = (
    targetData?: NavigateTargetData | null,
    args?: UrlArgs | null,
  ) => {
    const urlParts = [];
    if (targetData?.type == 'custom') {
      urlParts.push(targetData.target);
    } else if (targetData?.maintainUrl) {
      urlParts.push(params.baseUrl);
    } else {
      urlParts.push(params.homeUrl);
    }

    if (targetData?.type == 'record') {
      if (targetData?.sObject) {
        urlParts.push('lightning', 'r', targetData.sObject, targetData.recordId, 'view');
      } else {
        urlParts.push(targetData.recordId);
      }
    }

    if (targetData?.type == 'object') {
      if (targetData?.sObject) {
        urlParts.push('lightning', 'o', targetData.sObject, 'home');
      }
    }

    if (targetData?.type == 'apex') {
      if (targetData?.page) {
        urlParts.push('apex', targetData.page);
      }
    }

    if (targetData?.type == 'lightning') {
      if (targetData?.page) {
        urlParts.push('lightning', 'page', targetData.page);
      }
    }

    if (targetData?.type == 'n') {
      if (targetData?.page) {
        urlParts.push('lightning', 'n', targetData.page);
      }
    }

    if (targetData?.type == 'settings') {
      if (targetData?.page) {
        urlParts.push('lightning', 'settings', 'personal', targetData.page, 'home');
      }
    }

    if (targetData?.type == 'setup') {
      if (targetData?.page) {
        urlParts.push('lightning', 'setup', targetData.page, 'home');
      }
    }

    let urlPath = urlParts.join('/');

    if (args && Object.keys(args).length > 0) {
      const argString = argObjToUrlString(args);
      if (argString) {
        urlPath = urlPath.concat('?', argString);
      }
    }

    if (targetData?.redirect) {
      chrome.tabs.update({
        url: urlPath,
      });
    } else {
      window.open(urlPath);
    }
  };

  const openExternal = (
    target?: string | null,
  ) => {
    if (target) window.open(target);
  };
  
  return {
    navigate,
    openExternal,
  };
};

export default useNav;
