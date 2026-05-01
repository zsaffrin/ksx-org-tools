import { createContext, FC, ReactNode, useState } from 'react';
import { AppStateContextType } from '../@types/AppState';

const AppStateContext = createContext<AppStateContextType | null>(null);

const AppStateProvider: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const [isUnpackagedOrg, setIsUnpackagedOrg] = useState<boolean>(false);
  const [showCopyLinks, setShowCopyLinks] = useState<boolean>(false);

  const toggleUnpackagedOrg = (val?: boolean) => {
    if (val) {
      setIsUnpackagedOrg(!!val);
    } else {
      setIsUnpackagedOrg(!isUnpackagedOrg);
    }
  };

  const toggleShowCopyLinks = (val?: boolean) => {
    if (val) {
      setShowCopyLinks(!!val);
    } else {
      setShowCopyLinks(!showCopyLinks);
    }
  };
  
  return (
    <AppStateContext.Provider value={{
      isUnpackagedOrg,
      toggleUnpackagedOrg,
      showCopyLinks,
      toggleShowCopyLinks,
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export {
  AppStateContext,
  AppStateProvider,
};