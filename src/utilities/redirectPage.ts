const redirectPage = (target: string | undefined) => {
  console.log('redirect page',{ target });
  if (target) {
    chrome.tabs.update({
      url: target,
    });
  }
};

export default redirectPage;