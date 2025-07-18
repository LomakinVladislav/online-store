import React from 'react';
import { List } from 'antd';
import { DeckCard } from '../DeckCard/DeckCard';
import { DeckListProps } from '@/types';

export const DeckList: React.FC<DeckListProps> = ({
  decks, 
  favorites, 
  loadingFavorites, 
  myDecks, 
  onToggleFavorite, 
  onCardClick, 
  onEditClick,
}) => {
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
      dataSource={decks}
      renderItem={(deck) => (
        <List.Item>
          <DeckCard
            deck={deck}
            isFavorite={favorites.has(deck.id)}
            loadingFavorite={!!loadingFavorites[deck.id]}
            onToggleFavorite={onToggleFavorite}
            onClick={onCardClick}
            isEditable={myDecks.has(deck.id)}
            onEditClick={onEditClick}
          />
        </List.Item>
      )}
    />
  );
};