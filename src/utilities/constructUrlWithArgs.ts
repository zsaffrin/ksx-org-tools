const constructUrlWithArgs = (
  baseUrl?: string | null,
  args?: {[keys: string | number]: string | number} | undefined
) => {
  if (!baseUrl) {
    return null;
  }

  let constructedUrl = baseUrl;

  if (args && Object.keys(args).length > 0) {
    const argKeySet: string[] = Object.keys(args).reduce((acc, argKey) => {
      return [
        ...acc,
        `${argKey}=${args[argKey]}`,
      ];
    }, [] as string[]);
    const argString = argKeySet.join('&');

    constructedUrl = constructedUrl.concat('?', argString);
  }

  return constructedUrl;
};

export default constructUrlWithArgs;