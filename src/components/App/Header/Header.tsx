import { useAppState } from '../../../hooks';
import { GoPackage } from 'react-icons/go';
import { LuPackageOpen } from 'react-icons/lu';


import './Header.css';

const Header = () => {
  const appState = useAppState();

  const handleToggleClick = () => {
    if (appState?.toggleUnpackagedOrg) {
      appState.toggleUnpackagedOrg();
    }
  };
  
  return (
    <div className="header-layout">
      <h1>KSX Org Tools</h1>
      <div>
        {appState?.isUnpackagedOrg
          ? <LuPackageOpen
              onClick={handleToggleClick}
              title='UNPACKAGED MODE - Links are not namespaced, click to toggle'
            />
          : <GoPackage
              onClick={handleToggleClick}
              title='PACKAGED MODE - Links are namespaced, click to toggle'
            />
        }
      </div>
    </div>
  );
};

export default Header;
