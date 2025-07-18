export interface MenuContextProps {
    activeMenuKey: string | null;
    setActiveMenuKey: (key: string | null) => void;
  }