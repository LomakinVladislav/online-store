// MenuContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type MenuContextType = {
  selectedMenuKey: string[];
  setSelectedMenuKey: (keys: string[]) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMenuKey, setSelectedMenuKey] = useState<string[]>(['1']);
  
  return (
    <MenuContext.Provider value={{ selectedMenuKey, setSelectedMenuKey }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};