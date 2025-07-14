import { useState, useEffect } from 'react';
import { getValidToken } from '../utils/auth';
import api from '../api/api';
import { isAxiosError } from 'axios';


export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [loadingFavorites, setLoadingFavorites] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (getValidToken()) {
      fetchFavorites();
    } else {
      setFavoritesLoading(false);
    }
  }, []);

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const response = await api.get<number[]>('http://127.0.0.1:8000/decks/favorites');
      setFavorites(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
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

  const handleAddFavorite = async (deckId: number) => {
    await api.post(`decks/favorites/${deckId}`);
    setFavorites(prev => [...prev, deckId]);
  };

  const handleDeleteFavorite = async (deckId: number) => {
    await api.delete(`decks/favorites/${deckId}`);
    setFavorites(prev => prev.filter(id => id !== deckId));
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

  return {
    favorites,
    favoritesLoading,
    loadingFavorites,
    handleAddFavorite,
    handleDeleteFavorite,
    toggleFavorite,
    fetchFavorites
  };
};