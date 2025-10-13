import useUrlParams from './useUrlParams';

const argObjToUrlString = (argObject?: {[key: number | string]: number | string | null} | null) => (
  argObject
    ? Object.keys(argObject).reduce((acc, argKey) => ([
      ...acc,
      `${argKey}=${argObject[argKey]}`
    ]), [] as string[]).join('&')
    : null
);

const useNav = () => {
  const params = useUrlParams();

  const constructTargetUrl = (
    target?: string | null,
    args?: {[key: number | string]: number | string | null} | null
  ) => {
    if (params.baseUrl) {
      let finalTarget = params.baseUrl;

      if (target) {
        finalTarget = finalTarget.concat('/', target);
      }

      if (args) {
        finalTarget = finalTarget.concat('?', argObjToUrlString(args) || '');
      }

      return finalTarget;
    }

    return;
  };

  const openNew = (
    target?: string | null,
    args?: {[key: number | string]: number | string | null} | null
  ) => {
    const targetUrl = constructTargetUrl(target, args);

    if (targetUrl) window.open(targetUrl);
  };

  const redirectTo = (
    target?: string | null,
    args?: {[key: number | string]: number | string | null} | null
  ) => {
    const targetUrl = constructTargetUrl(target, args);

    if (targetUrl) {
      chrome.tabs.update({
        url: targetUrl,
      });
    };
  };
  
  return {
    openNew,
    redirectTo,
  };
};

export default useNav;
