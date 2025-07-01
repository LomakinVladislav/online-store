import React, { useEffect, useState } from "react";
import { Card, List } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
}


const Main: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<IDeckData[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleClick = () => {
    navigate("/content");
  }

  return (
    <div >
      <div>
      {decks.length > 0 ? (
        <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={decks}
        renderItem={(deck) => (
          <List.Item>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt="card" src="https://www.tursar.ru/image/img2535_0.jpg" />}
              onClick={handleClick}
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
        <div>Loading decks...</div>
      )}
      </div>  
    </div>
    )
}

export default Main; 