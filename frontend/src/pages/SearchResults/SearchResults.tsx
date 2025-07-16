import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './SearchResults.module.css';
import { useMenu } from '../../contexts/MenuContext';
import api from '../../api/api';
import { AxiosRequestConfig} from 'axios';
import { IDeckData } from '@/types';
import { DeckList } from '../../components/DeckList/DeckList';
import { useFavorites } from '../../hooks/useFavorites';
import { Spin } from "antd";


interface ICustomAxiosConfig extends AxiosRequestConfig {
  skipRedirect?: boolean;
}

const SearchResults = () => {
    const { setActiveMenuKey } = useMenu();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [searchResults, setSearchResults] = useState<IDeckData[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const {
      favorites,
      favoritesLoading,
      loadingFavorites,
      toggleFavorite
    } = useFavorites();
  
    const isLoading = searchLoading || favoritesLoading;
  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('query') || '';
  
      const fetchData = async () => {
        if (query) {
          try {
            setSearchLoading(true);
            const response = await api.get<IDeckData[]>(`http://127.0.0.1:8000/decks/search?query=${query}`, {
              skipRedirect: true
            } as ICustomAxiosConfig);
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
  
    return (
      <div className={styles.mainContainer}>
        <h1>Результаты поиска</h1>
        
        {isLoading ? (
          <div><Spin size="large" tip="Загрузка данных..." /></div>
        ) : error ? (
          <div>{error}</div>
        ) : searchResults.length > 0 ? (
          <DeckList 
            decks={searchResults}
            favorites={favorites}
            loadingFavorites={loadingFavorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
          />
        ) : (
          <p>Ничего не найдено</p>
        )}
      </div>
    );
  };
  
  export default SearchResults;
  