import { useState, useEffect, useCallback } from 'react';
import { getValidToken } from '../utils/auth';
import api from '../api/api';
import { isAxiosError } from 'axios';
import { UseFavoritesResult, DeckId } from '@/types';

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<Set<DeckId>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState<Record<DeckId, boolean>>({});

  const fetchFavorites = useCallback(async () => {
    try {
      setFavoritesLoading(true);
      const response = await api.get<DeckId[]>('/decks/favorites');
      setFavorites(new Set(response.data));
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setFavorites(new Set());
        } else {
          console.error('Error fetching favorites:', error);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getValidToken()) fetchFavorites();
    else setFavoritesLoading(false);
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (deckId: DeckId) => {
    setLoadingFavorites(prev => ({ ...prev, [deckId]: true }));
    
    try {
      await api.post(`decks/favorites/${deckId}`);
      setFavorites(prev => new Set(prev).add(deckId));
    } catch (error) {
      console.error('Error adding favorite:', error);
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [deckId]: false }));
    }
  }, []);

  const removeFavorite = useCallback(async (deckId: DeckId) => {
    setLoadingFavorites(prev => ({ ...prev, [deckId]: true }));
    
    try {
      await api.delete(`decks/favorites/${deckId}`);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(deckId);
        return newSet;
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [deckId]: false }));
    }
  }, []);

  return {
    favorites,
    favoritesLoading,
    loadingFavorites,
    addFavorite,
    removeFavorite
  };
};