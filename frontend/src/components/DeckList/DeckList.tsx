import React from 'react';
import { List } from 'antd';
import { DeckCard } from '../DeckCard/DeckCard';
import { IDeckData } from '@/types';


interface DeckListProps {
  decks: IDeckData[];
  favorites: number[];
  loadingFavorites: { [key: number]: boolean };
  onToggleFavorite: (deckId: number, e: React.MouseEvent) => void;
  onCardClick: (deckId: number) => void;
}

export const DeckList: React.FC<DeckListProps> = ({
  decks,
  favorites,
  loadingFavorites,
  onToggleFavorite,
  onCardClick
}) => {
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
      dataSource={decks}
      renderItem={(deck) => (
        <List.Item>
          <DeckCard
            deck={deck}
            isFavorite={favorites.includes(deck.id)}
            loadingFavorite={loadingFavorites[deck.id] || false}
            onToggleFavorite={onToggleFavorite}
            onClick={onCardClick}
          />
        </List.Item>
      )}
    />
  );
};