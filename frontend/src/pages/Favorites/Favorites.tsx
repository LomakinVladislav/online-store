import React, { useEffect, useState, useCallback } from "react";
import { Button, Modal, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import styles from './Favorites.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { DeckList } from '../../components/DeckList/DeckList';
import { useFavorites } from '../../hooks/useFavorites';
import { useMyDecks } from '../../hooks/useMyDecks';
import { IDeckData, UseFavoritesResult, UseMyDecksResult, DeckId } from '@/types';

const Favorites: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const [confirmDeckId, setConfirmDeckId] = useState<DeckId | null>(null);
  const { myDecks, loading: myDecksLoading }: UseMyDecksResult = useMyDecks();
  const { favorites, favoritesLoading, addFavorite, removeFavorite }: UseFavoritesResult = useFavorites();
  const navigate = useNavigate();

  const favoriteDecks = decks.filter(deck => favorites.has(deck.id));
  const isLoading = decksLoading || favoritesLoading || myDecksLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-favorites');
    fetchDecks();
  }, []);

  const fetchDecks = useCallback(async () => {
    try {
      setDecksLoading(true);
      
      const [publicDecks, myDecksResponse] = await Promise.all([
        api.get<IDeckData[]>('/decks'),
        api.get<IDeckData[]>('/decks/my_decks')
      ]);

      const decksMap = new Map<DeckId, IDeckData>();
      [...publicDecks.data, ...myDecksResponse.data].forEach(deck => {
        decksMap.set(deck.id, deck);
      });

      setDecks(Array.from(decksMap.values()));
    } catch (err) {
      console.error('Error fetching decks:', err);
      setError('Не удалось загрузить колоды');
    } finally {
      setDecksLoading(false);
    }
  }, []);

  const toggleFavorite = (deckId: DeckId, e: React.MouseEvent) => {
    e.stopPropagation();
    favorites.has(deckId) 
      ? setConfirmDeckId(deckId) 
      : addFavorite(deckId);
  };

  const confirmRemoveFavorite = async () => {
    if (confirmDeckId === null) return;
    
    try {
      await removeFavorite(confirmDeckId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setConfirmDeckId(null);
    }
  };

  const cancelRemoveFavorite = () => setConfirmDeckId(null);

  const handleCardClick = (deckId: DeckId) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
  };

  const handleEditClick = (deckId: DeckId) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/deck_editing`);
  };

  const goToMain = () => {
    setActiveMenuKey('sidebar-home');
    navigate('/main');
  };

  return (
    <div className={styles.mainContainer}>
      <Modal
        title="Подтверждение удаления"
        open={confirmDeckId !== null}
        onOk={confirmRemoveFavorite}
        onCancel={cancelRemoveFavorite}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>Вы уверены, что хотите удалить эту колоду из избранного?</p>
      </Modal>

      {isLoading ? (
        <div className={styles.loadContainer}>
          <Spin size="large" tip="Загрузка данных..." />
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : favoriteDecks.length > 0 ? (
        <DeckList 
          decks={favoriteDecks}
          favorites={favorites}
          loadingFavorites={{}}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
          myDecks={myDecks}
          onEditClick={handleEditClick}
        />
      ) : (
        <div className={styles.warningContainer}>
          <h1>В вашем избранном пока нет ни одной колоды</h1>
          <Button
            type="primary" 
            className={styles.mainButton}
            onClick={goToMain}
          >
            На главную  
          </Button>
        </div>  
      )}
    </div>
  )
}

export default Favorites;