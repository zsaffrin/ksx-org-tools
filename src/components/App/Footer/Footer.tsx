import { FaGithub } from 'react-icons/fa';
import { openNewPage } from '../../../utilities';
import './Footer.css';

const Footer = () => {
  const version = __APP_VERSION__;
  
  return (
    <div className='footer-layout'>
      <FaGithub className='icon' onClick={() => openNewPage('github.com', '/zsaffrin/ksx-org-tools')} />
      <div className='info'>
        <a onClick={() => openNewPage('github.com', '/zsaffrin/ksx-org-tools')}>
          {`v${version}`}
        </a>
      </div>
    </div>
  );
};

export default Footer;
