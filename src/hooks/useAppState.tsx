import { useContext } from 'react';
import { AppStateContext } from '../contexts';

const useAppState = () => {
  const appState = useContext(AppStateContext);

  return appState;
};

export default useAppState;