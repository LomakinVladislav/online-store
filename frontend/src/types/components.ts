import { IDeckData, DeckId } from "./deck";
import { ReactMouseEvent } from "./common";


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