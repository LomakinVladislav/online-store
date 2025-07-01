  import React, { useEffect, useState } from "react";
  import CardComponent from "../Card/Card";
  import styles from "./DeckContent.module.css"
  import { Card, Carousel, List } from 'antd';
  import axios from "axios";


  const { Meta } = Card;

  interface ICardData {
    id: number;
    deck_id: number;
    front_text: string;
    back_text: string;
  }


  const DeckContent: React.FC = () => {
    const [cards, setCards] = useState<ICardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [flipped, setFlipped] = useState<boolean>(false);
    
    useEffect(() => {
      fetchCards();
    }, []);


    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ICardData[]>('http://127.0.0.1:8000/card');
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
        setError('Не удалось загрузить карточки');
      } finally {
        setLoading(false);
      }
    };

    const contentStyle: React.CSSProperties = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center', // теперь это конкретное значение
      background: '#364d79',
      borderRadius: '8px',
    };

    const containerStyle = {
      width: '100%',
      maxWidth: '1200px', // Ограничиваем максимальную ширину
      margin: '0 auto', // Центрирование
      padding: '20px',
    };  

    if (loading) return <div className={styles.loading}>Загрузка карточек...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (cards.length === 0) return <div>Нет доступных карточек</div>;

    return (
      <div >
        <div style={containerStyle}>
      <h2>Вы вошли в колоду карт, здесь собран тематический набор</h2>
      <Carousel arrows autoplay>
        <div>
          <h3 style={contentStyle}>Слайд 1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Слайд 2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Слайд 3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>Слайд 4</h3>
        </div>
      </Carousel>
    </div>
      </div>
    )
  }

  export default DeckContent; 