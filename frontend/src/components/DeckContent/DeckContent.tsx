import React, { useEffect, useState } from "react";
import { Card} from 'antd';
import Deck from "../Deck/Deck";
import styles from "./Content.module.css"
import axios from "axios";


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

const Content: React.FC = () => {
  return (
    <Deck/>
  )
}

export default Content; 