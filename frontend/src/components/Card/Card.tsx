import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { Card} from 'antd';
import axios from "axios";

const { Meta } = Card;

interface ICardData {
  id: number;
  deck_id: number;
  front_text: string;
  back_text: string;
}

interface ICardItem {
  title: string;
  key: number;
}

const CardComponent: React.FC = () => {
  const [cards, setCards] = useState<ICardItem[]>([]);

  const fetchCards = async () => {
    try {
      const response = await axios.get<ICardData[]>('http://127.0.0.1:8000/cards');
      const cardsInfo = response.data.map((card: ICardData) => ({
        title: card.front_text,
        key: card.id,
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
          style={{ width: 240 }}
          cover={<img alt="example" src="https://www.tursar.ru/image/img2535_0.jpg" />}
        >
              <Meta title="The jerboa [ʤɜːˈbəʊə]" description="Тушканчик" />

        </Card>
      ) : (
        <div>Loading cards...</div>
      )}
    </div> 
)};
export default CardComponent;