import { useAppState } from '../../../hooks';
import { GoPackage } from 'react-icons/go';
import { LuPackageOpen } from 'react-icons/lu';
import { FaRegCopy } from 'react-icons/fa';
import { IoIosCopy } from 'react-icons/io';



import './Header.css';

const Header = () => {
  const appState = useAppState();

  const handleShowCopyLinksToggleClick = () => {
    if (appState?.toggleShowCopyLinks) {
      appState.toggleShowCopyLinks();
    }
  };

  const handleUnpackagedToggleClick = () => {
    if (appState?.toggleUnpackagedOrg) {
      appState.toggleUnpackagedOrg();
    }
  };
  
  return (
    <div className="header-layout">
      <h1>KSX Org Tools</h1>
      <div>
        {appState?.showCopyLinks
          ? <IoIosCopy
              onClick={handleShowCopyLinksToggleClick}
              title='Hide Copy Links'
            />
          : <FaRegCopy
              onClick={handleShowCopyLinksToggleClick}
              title='Show Copy Links'
            />
        }
      </div>
      <div>
        {appState?.isUnpackagedOrg
          ? <LuPackageOpen
              onClick={handleUnpackagedToggleClick}
              title='UNPACKAGED MODE - Links are not namespaced, click to toggle'
            />
          : <GoPackage
              onClick={handleUnpackagedToggleClick}
              title='PACKAGED MODE - Links are namespaced, click to toggle'
            />
        }
      </div>
    </div>
  );
};

export default Header;
