import { useState } from 'react';
import { useNav, useUrlParams } from '../../../hooks';
import { FaBug, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const params = useUrlParams();
  const { navigate } = useNav();
  
  const version = __APP_VERSION__;
  
  return (
    <div className='footer-layout'>
      <div className='footer-action-row'>
        <FaGithub className='icon' onClick={() => navigate({ 
            type: 'custom',
            target: 'https://github.com/zsaffrin/ksx-org-tools',
            external: true
          })} />
        <div className='info'>
          <a onClick={() => navigate({ 
            type: 'custom',
            target: 'https://github.com/zsaffrin/ksx-org-tools',
            external: true
          })}>
            {`v${version}`}
          </a>
        </div>
        <FaBug
          className={'icon' + (showDebug ? ' debugOpen' : ' debugClosed')}
          onClick={() => setShowDebug(!showDebug)}
          title='Show debug data'
        />
      </div>
      {showDebug && (
        <div className='footer-debug'>
          <pre>{JSON.stringify(params, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Footer;
