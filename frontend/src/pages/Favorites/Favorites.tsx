import React, { useEffect, useState } from "react";
import { Button, Modal, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import styles from './Favorites.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { IDeckData } from '@/types';
import { useFavorites } from '../../hooks/useFavorites';
import { DeckList } from '../../components/DeckList/DeckList';


const Favorites: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const [confirmDeckId, setConfirmDeckId] = useState<number | null>(null);
  const navigate = useNavigate();

  const {
    favorites,
    favoritesLoading,
    loadingFavorites,
    handleAddFavorite,
    handleDeleteFavorite
  } = useFavorites();

  const favoriteDecks = decks.filter(deck => favorites.includes(deck.id));
  const isLoading = decksLoading || favoritesLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-favorites');
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setDecksLoading(true);
      const [publicDecks, myDecks] = await Promise.all([
        api.get<IDeckData[]>('http://127.0.0.1:8000/decks'),
        api.get<IDeckData[]>('http://127.0.0.1:8000/decks/my_decks')
      ]);
  
      const combinedDecks = [...publicDecks.data, ...myDecks.data];
      const uniqueDecks = Array.from(
        new Map(combinedDecks.map(deck => [deck.id, deck])).values()
      );
      
      setDecks(uniqueDecks);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Не удалось загрузить колоды');
    } finally {
      setDecksLoading(false);
    }
  };

  const toggleFavorite = (deckId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (favorites.includes(deckId)) {
      setConfirmDeckId(deckId);
    } else {
      handleAddFavorite(deckId);
    }
  };

  const confirmRemoveFavorite = async () => {
    if (confirmDeckId === null) return;
    
    try {
      await handleDeleteFavorite(confirmDeckId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setConfirmDeckId(null);
    }
  };

  const cancelRemoveFavorite = () => {
    setConfirmDeckId(null);
  };

  const handleCardClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
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
        <div><Spin size="large" tip="Загрузка данных..." /></div>
      ) : error ? (
        <div>{error}</div>
      ) : favoriteDecks.length > 0 ? (
        <DeckList 
          decks={favoriteDecks}
          favorites={favorites}
          loadingFavorites={loadingFavorites}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
        />
      ) : (
        <div className={styles.warningContainer}>
          <h1>В вашем избранном пока нет ни одной колоды</h1>
          <Button
            type="primary" 
            style={{ marginBottom: 16 }}
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