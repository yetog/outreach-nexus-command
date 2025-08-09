import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AppSettingsContextValue {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

const STORAGE_KEY = 'onx.backendUrl';

export const AppSettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [backendUrl, setBackendUrlState] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBackendUrlState(saved);
  }, []);

  const setBackendUrl = (url: string) => {
    setBackendUrlState(url);
    localStorage.setItem(STORAGE_KEY, url);
  };

  const value = useMemo(() => ({ backendUrl, setBackendUrl }), [backendUrl]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
};
