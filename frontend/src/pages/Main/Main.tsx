import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Main.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { DeckList } from '../../components/DeckList/DeckList';
import { Spin } from "antd";
import { useMyDecks } from '../../hooks/useMyDecks';
import { useFavorites } from '../../hooks/useFavorites';
import { IDeckData, UseFavoritesResult, DeckId, UseMyDecksResult } from '@/types';

const Main: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const navigate = useNavigate();
  const { myDecks, loading: myDecksLoading }: UseMyDecksResult = useMyDecks();
  const { favorites, favoritesLoading, addFavorite, removeFavorite }: UseFavoritesResult = useFavorites();

  const isLoading = decksLoading || favoritesLoading || myDecksLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-home');
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setDecksLoading(true);
      const response = await api.get<IDeckData[]>('/decks', {
        skipRedirect: true
      });
      setDecks(response.data);
    } catch (err) {
      console.error('Error fetching decks:', err);
      setError('Не удалось загрузить колоды');
    } finally {
      setDecksLoading(false);
    }
  };

  const handleEditClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/deck_editing`);
  };

  const handleCardClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
  };

  const toggleFavorite = (deckId: DeckId, e: React.MouseEvent) => {
    e.stopPropagation();
    favorites.has(deckId) 
      ? removeFavorite(deckId)
      : addFavorite(deckId);
  };

  return (
    <div className={styles.mainContainer}>
      {isLoading ? (
        <div className={styles.loadContainer}><Spin size="large" tip="Загрузка данных..." /></div>
      ) : error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : decks.length > 0 ? (
        <DeckList 
          decks={decks}
          favorites={favorites}
          loadingFavorites={{}}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
          myDecks={myDecks}
          onEditClick={handleEditClick}
        />
      ) : (
        <div className={styles.emptyContainer}>Нет доступных колод</div>
      )}
    </div>
  )
}

export default Main;