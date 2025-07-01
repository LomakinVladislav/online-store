import React, { useEffect, useState } from "react";
import { Card} from 'antd';
import Deck from "../../components/Deck/Deck";
import styles from "./Main.module.css"
import axios from "axios";
import { ConfigProvider } from 'antd';
import { ignore } from "antd/es/theme/useToken";
import { inherits } from "util";
import { Link, useNavigate } from "react-router-dom";

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

interface IDeckItem {
  title: string;
  key: number;
}

const Main: React.FC = () => {
  const [decks, setDecks] = useState<IDeckItem[]>([]);
  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      const response = await axios.get<IDeckData[]>('http://127.0.0.1:8000/decks');
      const decksInfo = response.data.map((deck: IDeckData) => ({
        title: deck.title,
        key: deck.id,
      }));
      setDecks(decksInfo);
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  };


  useEffect(() => {
    fetchDecks();
  }, []);


  const handleClick = () => {
    navigate("/content");
  }


  return (
    <div className={styles[`content-container`]}>
      <div>
      {decks.length > 0 ? (
        <Card 
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://motherspet.com/blogs/wp-content/uploads/2024/07/100-wild-animals.jpg" />}
          onClick={handleClick}
        >
         <Meta title={decks[2].title} description="Животные" />
        </Card>
      ) : (
        <div>Loading decks...</div>
      )}
      </div>  
    </div>
    )
}

export default Main; 