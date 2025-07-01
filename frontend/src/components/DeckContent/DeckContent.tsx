  import React, { useEffect, useState } from "react";
  import CardComponent from "../Card/Card";
  import styles from "./DeckContent.module.css"
  import { Card, List } from 'antd';
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

    useEffect(() => {
      fetchCards();
    }, []);

    if (loading) return <div className={styles.loading}>Загрузка карточек...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (cards.length === 0) return <div>Нет доступных карточек</div>;

    return (
      <div >
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={cards}
          renderItem={(card) => (
            <List.Item>
              <Card
                onClick={() => setFlipped(!flipped)}
                hoverable
                style={{ width: 240 }}
                cover={<img alt="card" src="https://www.tursar.ru/image/img2535_0.jpg" />}
              >
                {flipped ? (
                  <Meta title={card.back_text} />
                ) : (
                  <Meta title={card.front_text} />
                )}
              </Card>
            </List.Item>
          )}
        />
      </div>
    )
  }

  export default DeckContent; 