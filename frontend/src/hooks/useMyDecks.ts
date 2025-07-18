import { useState, useEffect } from 'react';
import { getValidToken } from '../utils/auth';
import api from '../api/api';
import { isAxiosError } from 'axios';

export const useMyDecks = () => {
  const [myDecks, setMyDecks] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyDecks = async () => {
      if (!getValidToken()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/decks/my_decks');
        const deckIds = response.data.map((deck: any) => deck.id);
        setMyDecks(deckIds);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response?.status === 401) {
            setMyDecks([]);
          } else {
            setError('Ошибка при загрузке ваших колод');
          }
        } else {
          setError('Неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyDecks();
  }, []);

  return { myDecks, loading, error };
};