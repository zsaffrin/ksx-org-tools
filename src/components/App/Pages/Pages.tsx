import useTabData from '../../../hooks/useTabData';
import './Pages.css';

const Pages = () => {
  const { domain } = useTabData();

  const openNewPage = (targetUrl: string) => {
    window.open('https://' + domain + targetUrl);
  };

  const targetList = [
    { title: 'Job Administration', target: '/apex/KimbleOne__JobAdministration' },
  ];

  const targetNodes = targetList.map(({ title, target }) => (
    <button
      type='button'
      onClick={() => openNewPage(target)}
    >
      {title}
    </button>
  ));
  
  return (
    <div className="pages-layout">
      <h2>Pages</h2>
      {targetNodes}
    </div>
  );
};

export default Pages;
