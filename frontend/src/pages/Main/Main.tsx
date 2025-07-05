import React, { useEffect, useState } from "react";
import { Card, List } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './Main.module.css'
import { useMenuContext  } from '../../contexts/MenuContext';

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


const Main: React.FC = () => {
  const { setSelectedMenuKey } = useMenuContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
      try {
        setLoading(true);
        const response = await axios.get<IDeckData[]>('http://127.0.0.1:8000/decks');
        setDecks(response.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setError('Не удалось загрузить карточки');
      } finally {
        setLoading(false);
      }
    };  

  const handleCardClick = (deckId: number) => {
    setSelectedMenuKey([]);
    navigate(`/decks/${deckId}/content`);
  };

  return (
    <div className={styles.mainContainer}>
    {loading ? (
      <div>Загрузка наборов...</div>
    ) : error ? (
      <div className={styles.error}>{error}</div>
    ) : decks.length > 0 ? (
      <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={decks}
        renderItem={(deck) => (
          <List.Item>
            <Card
              hoverable
              className={styles.deckCard}
              cover={
                <img 
                  alt={deck.title} 
                  src={deck.image_url} 
                  className={styles.cardImage}
                />
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