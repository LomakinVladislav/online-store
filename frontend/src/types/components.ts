import { IDeckData, DeckId } from "./deck";
import { ReactMouseEvent } from "./common";
import { ReactNode } from 'react';


export interface DeckListProps {
  decks: IDeckData[];
  favorites: Set<DeckId>;
  loadingFavorites: Record<DeckId, boolean>;
  myDecks: Set<DeckId>;
  onToggleFavorite: (deckId: DeckId, e: ReactMouseEvent) => void;
  onCardClick: (deckId: DeckId) => void;
  onEditClick: (deckId: DeckId) => void;
}

export interface DeckCardProps {
  deck: IDeckData;
  isFavorite: boolean;
  loadingFavorite: boolean;
  isEditable: boolean;
  onToggleFavorite: (deckId: DeckId, e: ReactMouseEvent) => void;
  onClick: (deckId: DeckId) => void;
  onEditClick?: (deckId: DeckId) => void;
}

export type HeaderProps = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  children?: MenuItem[];
}

export interface LayoutComponentProps {
  children?: ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}