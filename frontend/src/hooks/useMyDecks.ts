import { useState, useEffect, useCallback } from 'react';
import { getValidToken } from '../utils/auth';
import api from '../api/api';
import { isAxiosError } from 'axios';
import { UseMyDecksResult } from '@/types';

export const useMyDecks = (): UseMyDecksResult => {
  const [myDecks, setMyDecks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyDecks = useCallback(async () => {
    if (!getValidToken()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/decks/my_decks');
      const deckIds = response.data.map((deck: any) => deck.id);
      setMyDecks(new Set(deckIds));
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setMyDecks(new Set());
        } else {
          setError('Ошибка при загрузке ваших колод');
        }
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyDecks();
  }, [fetchMyDecks]);

  return { myDecks, loading, error };
};