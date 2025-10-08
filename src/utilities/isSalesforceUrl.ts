const isSalesforceUrl = (url: string) => {
  if (url) {
    const hasSalesforceTLD = url.includes('.force.com');

    if (hasSalesforceTLD) {
      return true;
    }
  }
  
  return false;
};

export default isSalesforceUrl;