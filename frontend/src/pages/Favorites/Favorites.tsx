import React, { useEffect, useState } from "react";
import { Button, Card, List, Modal } from 'antd'; // Добавляем Modal из antd
import { HeartFilled, HeartOutlined } from '@ant-design/icons'; 
import { useNavigate } from "react-router-dom";
import styles from './Favorites.module.css'
import { useMenu  } from '../../contexts/MenuContext';
import api from '../../api/api';
import { isAxiosError } from 'axios';

const { Meta } = Card;

interface IDeckData {
  id: number;
  creator_user_id: number;
  title: string;
  theme: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  difficulty: string;
  image_url: string;
}

const Favorites: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState<boolean>(true);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<{ [key: number]: boolean }>({});
  const [confirmDeckId, setConfirmDeckId] = useState<number | null>(null);
  const navigate = useNavigate();

  const isLoading = decksLoading || favoritesLoading;
  const favoriteDecks = decks.filter(deck => favorites.includes(deck.id));

  useEffect(() => {
    setActiveMenuKey('sidebar-favorites');
    
    const loadData = async () => {
      try {
        await fetchDecks();
        await fetchFavorites();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
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
      setError('Не удалось загрузить карточки');
    } finally {
      setDecksLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await api.get<number[]>('http://127.0.0.1:8000/decks/favorites');
      setFavorites(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Пользователь не авторизован');
          setFavorites([]);
        } else {
          console.error('Error fetching favorites:', error);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setFavoritesLoading(false);
    }
  };
  
  const toggleFavorite = async (deckId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (favorites.includes(deckId)) {
      setConfirmDeckId(deckId);
    } else {
      setLoadingFavorites(prev => ({ ...prev, [deckId]: true }));
      try {
        await handleAddFavorite(deckId);
      } catch (error) {
        console.error('Error adding favorite:', error);
      } finally {
        setLoadingFavorites(prev => ({ ...prev, [deckId]: false }));
      }
    }
  };

  const confirmRemoveFavorite = async () => {
    if (confirmDeckId === null) return;
    
    setLoadingFavorites(prev => ({ ...prev, [confirmDeckId]: true }));
    try {
      await handleDeleteFavorite(confirmDeckId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [confirmDeckId]: false }));
      setConfirmDeckId(null);
    }
  };

  const cancelRemoveFavorite = () => {
    setConfirmDeckId(null);
  };

  const handleAddFavorite = async (deckId: number) => {
    await api.post(`decks/favorites/${deckId}`);
    setFavorites(prev => [...prev, deckId]);
  };

  const handleDeleteFavorite = async (deckId: number) => {
    await api.delete(`decks/favorites/${deckId}`);
    setFavorites(prev => prev.filter(id => id !== deckId));
  };
  
  const handleCardClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
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
        <div>Загрузка данных...</div>
      ) : error ? (
        <div >{error}</div>
      ) : favoriteDecks.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={favoriteDecks}
          renderItem={(deck) => (
            <List.Item>
              <Card
                className={styles.deckCard}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img 
                      alt={deck.title} 
                      src={deck.image_url} 
                      className={styles.cardImage}
                    />
                    <button 
                      className={styles.favoriteButton}
                      onClick={(e) => toggleFavorite(deck.id, e)}
                      disabled={loadingFavorites[deck.id]}  
                    >
                      {favorites.includes(deck.id) 
                        ? <HeartFilled style={{ color: '#ff4d4f' }} /> 
                        : <HeartOutlined />
                      }
                    </button>
                  </div>
                }
                onClick={() => handleCardClick(deck.id)}
              >
                <Meta 
                  title={deck.title} 
                  description={deck.description} 
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div className={styles.warningContainer}>
          <h1>В вашем избранном пока нет ни одной колоды</h1>
          <Button
          type="primary" 
          style={{ marginBottom: 16 }}
          onClick={
            () => {
              setActiveMenuKey('sidebar-home');
              navigate('/main')
            }
            }>
              На главную
          </Button>
        </div>  
      )}
    </div>
  )
}

export default Favorites;