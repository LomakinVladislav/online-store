import React, { createContext, useContext, useState } from 'react';

interface MenuContextProps {
  activeMenuKey: string | null;
  setActiveMenuKey: (key: string | null) => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);

  return (
    <MenuContext.Provider value={{ activeMenuKey, setActiveMenuKey }}>
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