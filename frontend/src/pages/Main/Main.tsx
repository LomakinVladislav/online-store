import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Main.module.css'
import { useMenu  } from '../../contexts/MenuContext';
import api from '../../api/api';
import { AxiosRequestConfig } from 'axios';
import { useFavorites } from '../../hooks/useFavorites';
import { DeckList } from '../../components/DeckList/DeckList';
import { IDeckData } from '@/types';
import { Spin } from "antd";


interface ICustomAxiosConfig extends AxiosRequestConfig {
  skipRedirect?: boolean;
}

const Main: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const navigate = useNavigate();

  const {
    favorites,
    favoritesLoading,
    loadingFavorites,
    toggleFavorite
  } = useFavorites();

  const isLoading = decksLoading || favoritesLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-home');
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setDecksLoading(true);
      const response = await api.get<IDeckData[]>('http://127.0.0.1:8000/decks', {
        skipRedirect: true
      } as ICustomAxiosConfig);
      setDecks(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Не удалось загрузить колоды');
    } finally {
      setDecksLoading(false);
    }
  };

  const handleCardClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
  };

  return (
    <div className={styles.mainContainer}>
      {isLoading ? (
        <div className={styles.loadContainer}><Spin size="large" tip="Загрузка данных..." /></div>
      ) : error ? (
        <div>{error}</div>
      ) : decks.length > 0 ? (
        <DeckList 
          decks={decks}
          favorites={favorites}
          loadingFavorites={loadingFavorites}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
        />
      ) : (
        <div>Нет доступных колод</div>
      )}
    </div>
  )
}

export default Main;