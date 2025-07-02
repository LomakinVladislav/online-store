  import React, { useEffect, useState } from "react";
  import styles from "./DeckContent.module.css"
  import { Card, Button } from 'antd';
  import { LeftOutlined, RightOutlined } from '@ant-design/icons';
  import axios from "axios";


  const { Meta } = Card;

  interface ICardData {
    id: number;
    deck_id: number;
    front_text: string;
    back_text: string;
    transcription: string;
    image_url: string;
  }


  const DeckContent: React.FC = () => {
    const [cards, setCards] = useState<ICardData[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [flipped, setFlipped] = useState<boolean>(false);
    
    useEffect(() => {
      fetchCards();
    }, []);

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


    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ICardData[]>('http://127.0.0.1:8000/card');
        setCards(response.data);
        setCurrentCardIndex(0);
      } catch (error) {
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
  
    if (loading) return <div className={styles.loading}>Загрузка карточек...</div>;
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

              cover={<img alt="card" src={currentCard.image_url} width={300} height={300} />}
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