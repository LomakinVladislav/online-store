import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from "./DeckContent.module.css";
import { Card, Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from "axios";
import api from '../../api/api';
import { ICardData } from '@/types';

const { Meta } = Card;

const DeckContent: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<ICardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  
  const fetchCards = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get<ICardData[]>(`/decks/${id}/cards`);
      setCards(response.data);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/auth');
      } else {
        console.error('Error fetching cards:', error);
        setError('Не удалось загрузить карточки');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (deckId) fetchCards(deckId);
  }, [deckId, fetchCards]);

  const handleNext = useCallback(() => {
    setFlipped(false);
    setCurrentCardIndex(prev => (prev < cards.length - 1 ? prev + 1 : 0));
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : cards.length - 1));
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setFlipped(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') handleFlip();
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleFlip]);

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
              />
            }
          >
            
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
  );
};

export default DeckContent;