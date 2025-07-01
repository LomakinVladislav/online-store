import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const Deck: React.FC = () => (
  <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://www.tursar.ru/image/img2535_0.jpg" />}
  >
    <Meta title="The jerboa [ʤɜːˈbəʊə]" description="Тушканчик" />
  </Card>
);

export default Deck;