import { Dispatch, SetStateAction } from 'react';

export interface MenuContextProps {
    activeMenuKey: string | null;
    setActiveMenuKey: Dispatch<SetStateAction<string | null>>;
}