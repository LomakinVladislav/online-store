import React from "react";
import styles from "./Card.module.css";
import { Card} from 'antd';

const CardComponent: React.FC = () => (
  <Card title="Card title" variant="borderless" style={{height: 200, width: 200}}>
        Card content
  </Card> 
);
export default CardComponent;