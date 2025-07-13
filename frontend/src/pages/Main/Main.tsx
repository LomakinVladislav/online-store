import React, { useEffect, useState } from "react";
import { Card, List } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons'; 
import { useNavigate } from "react-router-dom";
import styles from './Main.module.css'
import { useMenu  } from '../../contexts/MenuContext';
import api from '../../api/api';
import { AxiosRequestConfig, isAxiosError } from 'axios';
import { getValidToken } from '../../utils/auth';


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

interface ICustomAxiosConfig extends AxiosRequestConfig {
  skipRedirect?: boolean;
}

const Main: React.FC = () => {
  const { setActiveMenuKey } = useMenu();
  const [decksLoading, setDecksLoading] = useState<boolean>(true);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  const isLoading = decksLoading || favoritesLoading;

  useEffect(() => {
    setActiveMenuKey('sidebar-home');
    
    fetchDecks();
    
    if (getValidToken()) {
      fetchFavorites();
    } else {
      setFavoritesLoading(false);
    }
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
    setLoadingFavorites(prev => ({ ...prev, [deckId]: true }));

    try {
      if (favorites.includes(deckId)) {
        await handleDeleteFavorite(deckId);
      } else {
        await handleAddFavorite(deckId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [deckId]: false }));
    }
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
      {isLoading ? (
        <div>Загрузка данных...</div>
      ) : error ? (
        <div >{error}</div>
      ) : decks.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={decks}
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
        <div>Нет доступных колод</div>
      )}
    </div>
  )
}

export default Main;