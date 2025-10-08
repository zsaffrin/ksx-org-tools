const openNewPage = (domain: string | null | undefined, target: string | undefined) => {
  if (domain) {
    window.open('https://' + domain + target);
  }
};

export default openNewPage;