import useAppState from './useAppState';
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
  const appState = useAppState();
  const params = useUrlParams();

  const withNamespace = (val: string) => (
    appState?.isUnpackagedOrg
      ? val.replace('KimbleOne__', '')
      : val
  );

  const buildRecordUrlParts = (
    recordId: string,
    sObject?: string | null,
  ) => {
    const urlParts: string[] = [];

    if (sObject) {
      urlParts.push('lightning', 'r', withNamespace(sObject), recordId, 'view');
    } else {
      urlParts.push(recordId);
    }

    return urlParts;
  };

  const buildObjectUrlParts = (
    sObject: string,
  ) => {
    const urlParts: string[] = [
      'lightning', 'o', withNamespace(sObject), 'home'
    ];
    return urlParts;
  };

  const buildApexUrlParts = (
    page: string,
  ) => {
    const urlParts: string[] = [
      'one', 'one.app#', 'alohaRedirect', 'apex', withNamespace(page)
    ];

    return urlParts;
  };

  const buildLightningUrlParts = (
    page: string,
  ) => {
    const urlParts: string[] = [
      'lightning', 'page', withNamespace(page)
    ];

    return urlParts;
  };

  const buildNamedPageUrlParts = (
    page: string,
  ) => {
    const urlParts: string[] = [
      'lightning', 'n', withNamespace(page)
    ];

    return urlParts;
  };

  const buildSettingsUrlParts = (
    page: string,
  ) => {
    const urlParts: string[] = [
      'lightning', 'settings', 'personal', page, 'home'
    ];

    return urlParts;
  };

  const buildSetupUrlParts = (
    page: string,
  ) => {
    const urlParts: string[] = [
      'lightning', 'setup', page, 'home'
    ];

    return urlParts;
  };

  const buildUrl = (
    data: NavigateTargetData,
    args?: UrlArgs,
  ) => {
    let urlBase: string | null = params.homeUrl || null;
    const urlParts: string[] = [];

    if (data.type == 'record') {
      urlBase = `${params.domainName}--kimbleone.vf.force.com`;
      const parts = buildRecordUrlParts(data.recordId || '', data.sObject);
      urlParts.push(...parts);
    }

    if (data.type == 'object') {
      const parts = buildObjectUrlParts(data.sObject || '');
      urlParts.push(...parts);
    }

    if (data.type == 'apex') {
      urlBase = `${params.domainName}--kimbleone.vf.force.com`;
      const parts = buildApexUrlParts(data.page || '');
      urlParts.push(...parts);
    }

    if (data.type == 'lightning') {
      const parts = buildLightningUrlParts(data.page || '');
      urlParts.push(...parts);
    }

    if (data.type == 'n') {
      const parts = buildNamedPageUrlParts(data.page || '');
      urlParts.push(...parts);
    }

    if (data.type == 'settings') {
      const parts = buildSettingsUrlParts(data.page || '');
      urlParts.push(...parts);
    }

    if (data.type == 'setup') {
      if (params.baseUrl) urlBase = params.baseUrl;
      const parts = buildSetupUrlParts(data.page || '');
      urlParts.push(...parts);
    }

    let urlPath = urlParts.join('/');

    if (args && Object.keys(args).length > 0) {
      const argString = argObjToUrlString(args);
      if (argString) {
        urlPath = urlPath.concat('?', argString);
      }
    }

    const fullUrl = `${params.protocol}//${urlBase || params.domain}/${urlPath}`;

    return fullUrl;
  };

  const navigate = (
    targetData?: NavigateTargetData | null,
    args?: UrlArgs | null,
  ) => {
    if (!targetData) {
      console.info('navigate call is missing targetData');
      return;
    }
    
    const targetUrl: string = targetData.type == 'custom'
      ? targetData.target || ''
      : buildUrl(targetData, args || undefined);

    if (targetData?.redirect) {
      chrome.tabs.update({
        url: targetUrl,
      });
    } else if (!targetUrl) {
      console.info('no targetUrl rendered');
    } else {
      window.open(targetUrl);
    }
  };
  
  return {
    buildUrl,
    navigate,
  };
};

export default useNav;
