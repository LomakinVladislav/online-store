import { DeckId } from "./deck";

export interface UseFavoritesResult {
  favorites: Set<DeckId>;
  favoritesLoading: boolean;
  loadingFavorites: Record<DeckId, boolean>;
  addFavorite: (deckId: DeckId) => Promise<void>;
  removeFavorite: (deckId: DeckId) => Promise<void>;
}

export interface UseMyDecksResult {
  myDecks: Set<DeckId>;
  loading: boolean;
  error: string | null;
}
