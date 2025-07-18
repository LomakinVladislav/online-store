import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { MenuContextProps } from '@/types';

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  
  const contextValue = useMemo(() => ({
    activeMenuKey, 
    setActiveMenuKey
  }), [activeMenuKey]);

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};