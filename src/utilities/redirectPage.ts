const redirectPage = (target: string | null | undefined) => {
  if (target) {
    chrome.tabs.update({
      url: target,
    });
  }
};

export default redirectPage;