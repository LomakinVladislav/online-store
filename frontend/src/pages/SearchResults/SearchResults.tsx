import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './SearchResults.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { IDeckData, DeckId } from '@/types';
import { DeckList } from '../../components/DeckList/DeckList';
import { Spin } from "antd";
import { useFavorites } from '../../hooks/useFavorites';
import { useMyDecks } from '../../hooks/useMyDecks';


const SearchResults = () => {
  const { setActiveMenuKey } = useMenu();
  const location = useLocation();
  const navigate = useNavigate();
  const { myDecks, loading: myDecksLoading } = useMyDecks()
  const [searchResults, setSearchResults] = useState<IDeckData[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, favoritesLoading, loadingFavorites, addFavorite, removeFavorite } = useFavorites();

  const isLoading = searchLoading || favoritesLoading || myDecksLoading;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '';

    const fetchData = async () => {
      if (query) {
        try {
          setSearchLoading(true);
          const response = await api.get<IDeckData[]>(`/decks/search?query=${query}`, {
            skipRedirect: true
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setError('Не удалось загрузить результаты поиска');
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleCardClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/content`);
  };
  
  const handleEditClick = (deckId: number) => {
    setActiveMenuKey(null);
    navigate(`/decks/${deckId}/deck_editing`);
  };

  const toggleFavorite = (deckId: DeckId, e: React.MouseEvent) => {
    e.stopPropagation();
    favorites.has(deckId) 
      ? removeFavorite(deckId)
      : addFavorite(deckId);
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Результаты поиска</h1>
      
      {isLoading ? (
        <div className={styles.loadContainer}><Spin size="large" tip="Загрузка данных..." /></div>
      ) : error ? (
        <div>{error}</div>
      ) : searchResults.length > 0 ? (
        <DeckList 
          decks={searchResults}
          favorites={favorites}
          loadingFavorites={loadingFavorites}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
          myDecks={myDecks}
          onEditClick={handleEditClick}
        />
      ) : (
        <p>Ничего не найдено</p>
      )}
    </div>
  );
  };
  
  export default SearchResults;
  