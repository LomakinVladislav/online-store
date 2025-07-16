import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from "./DeckContent.module.css"
import { Card, Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from "axios";
import api from '../../api/api'
import { ICardData } from '@/types';


const { Meta } = Card;

const DeckContent: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<ICardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (deckId) {
      fetchCards(deckId);
    }
  }, [deckId]);

  // Навигация с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') handleFlip();
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, flipped]);


  const fetchCards = async (deckId: string) => {
    try {
      setLoading(true);

      const response = await api.get<ICardData[]>(`/decks/${deckId}/cards`);

      setCards(response.data);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/auth');
          return; 
        }
      }
      
      console.error('Error fetching cards:', error);
      setError('Не удалось загрузить карточки');
    } finally {
      setLoading(false);
    }
  };


  const handleNext = () => {
    setFlipped(false);
    setCurrentCardIndex(prevIndex => 
      prevIndex < cards.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentCardIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : cards.length - 1
    );
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  if (loading) return <div className={styles.loadContainer}><Spin size="large" tip="Загрузка данных..." /></div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (cards.length === 0) return <div>Нет доступных карточек</div>;

  const currentCard = cards[currentCardIndex];


  return (
    <div className={styles.container}>
      <div className={styles.navigationContainer}>
        <Button 
          className={styles.navButton} 
          onClick={handlePrev}
          icon={<LeftOutlined />}
          size="large"
        />
        
        <div className={styles.cardContainer}>
          <Card
            onClick={handleFlip}
            className={styles.card}
            cover={
              <img 
                alt="card" 
                src={currentCard.image_url} 
                className={`${styles.cardImage} ${flipped ? styles.flippedImage : ''}`}
              />}
          >
            {flipped ? (
              <Meta title={currentCard.back_text} description={currentCard.transcription} />
            ) : (
              <Meta title={currentCard.front_text} />
            )}
          </Card>
          
          <div className={styles.cardCounter}>
            {currentCardIndex + 1} / {cards.length}
          </div>
        </div>
        
        <Button 
          className={styles.navButton} 
          onClick={handleNext}
          icon={<RightOutlined />}
          size="large"
        />
      </div>
    </div>
)
}

export default DeckContent; 