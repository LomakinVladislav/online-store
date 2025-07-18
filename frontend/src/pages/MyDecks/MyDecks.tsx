import React, { useEffect, useState } from "react";
import { Button, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import styles from './MyDecks.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { IDeckData } from '@/types';
import { useFavorites } from '../../hooks/useFavorites';
import { DeckList } from '../../components/DeckList/DeckList';
import { useMyDecks } from '../../hooks/useMyDecks';


const MyDecks: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const { myDecks, loading: myDecksLoading } = useMyDecks()
  const navigate = useNavigate();
  const { favorites, favoritesLoading, loadingFavorites, toggleFavorite } = useFavorites();

  const isLoading = decksLoading || favoritesLoading || myDecksLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-my_decks');
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setDecksLoading(true);
      const response = await api.get<IDeckData[]>('/decks/my_decks');
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

  const handleCreateDeck = () => {
    setActiveMenuKey('header-create');
    navigate('/deck_creation');
  };

  const handleEditClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/deck_editing`);
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
          myDecks={myDecks}
          onEditClick={handleEditClick}
        />
      ) : (
        <div className={styles.warningContainer}>
          <h1>Вы еще не создали ни одной колоды</h1>
          <Button
            type="primary" 
            style={{ marginBottom: 16 }}
            onClick={handleCreateDeck}
          >
            Создать
          </Button>
        </div>  
      )}
    </div>
  )
}

export default MyDecks;