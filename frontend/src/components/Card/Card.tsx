import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { Card} from 'antd';
import axios from "axios";

interface CardData {
  id: number;
  deck_id: number;
  front_text: string;
  back_text: string;
}

interface CardItem {
  title: string;
  key: number;
}
const CardComponent: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);

  const fetchCards = async () => {
    try {
      const response = await axios.get<CardData[]>('http://127.0.0.1:8000/card');
      const cardsInfo = response.data.map((c: CardData) => ({
        title: c.front_text,
        key: c.id,
      }));
      setCards(cardsInfo);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div>
      {cards.length > 0 ? (
        <Card 
          title={cards[1].title} 
          variant="borderless" 
          style={{ height: 200, width: 200 }}
        >
          Card content
        </Card>
      ) : (
        <div>Loading cards...</div>
      )}
    </div> 
)};
export default CardComponent;