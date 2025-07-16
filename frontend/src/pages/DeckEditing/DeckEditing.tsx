import React, { useState, useEffect, useRef } from 'react';
import styles from './DeckEditing.module.css';
import { 
  Button, Form, Input, Radio, Rate, Select, message, Card, Row, Col, Spin 
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../api/api';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

interface FormValues {
    id: number;
    title: string;
    privacy: 'public' | 'private';
    image_url: string;
    category: string;
    description: string;
    difficulty: number;
}

interface DeckType {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  is_public: boolean;
  difficulty: number;
}

interface CardType {
    id: number;
    front_text: string;
    back_text: string;
    transcription: string;
    image_url: string;
}

interface ApiError {
    detail?: string;
    [key: string]: any;
}

const DeckEditing: React.FC = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const nextTempId = useRef(-1);

    const [deckData, setDeckData] = useState<DeckType | null>(null);
    const [cards, setCards] = useState<CardType[]>([]);

    useEffect(() => {
        const fetchDeckData = async () => {
        try {
            const response = await api.get(`/decks/${deckId}/information/`);
            const { deck, cards: deckCards } = response.data;
            
            setDeckData(deck);
            form.setFieldsValue({
                id: deck.id,
                title: deck.title,
                privacy: deck.is_public ? 'public' : 'private',
                image_url: deck.image_url,
                category: deck.category,
                description: deck.description,
                difficulty: deck.difficulty,
            });
        
            setCards(deckCards);
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            messageApi.error('Ошибка загрузки данных: ' + (error.response?.data?.detail || error.message));
        } finally {
            setFetching(false);
        }
    };

    fetchDeckData();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    }, [deckId, form, messageApi]);

const addCard = () => {
    const newId = nextTempId.current--;
    setCards([...cards, { 
        id: newId,
        front_text: '', 
        back_text: '', 
        transcription: '', 
        image_url: '' 
    }]);
};

const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
};

const updateCard = (index: number, field: keyof CardType, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
};

const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try { 
        new URL(url); 
        return true; 
    } catch { 
        return false; 
    }
};

const validateCards = (): boolean => {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const errors = [];
      
      if (!card.front_text.trim()) errors.push("Текст лицевой стороны");
      if (!card.back_text.trim()) errors.push("Текст обратной стороны");
      
      if (errors.length > 0) {
        messageApi.error(`Заполните обязательные поля в карточке ${i + 1}: ${errors.join(", ")}`);
        return false;
      }
      
      if (!isValidUrl(card.image_url)) {
        messageApi.error(`Некорректный URL изображения в карточке ${i + 1}`);
        return false;
      }
    }
    return true;
};

const handleSubmit = async (values: FormValues) => {
    if (!validateCards() || !deckData) return;
    
    try {
      setLoading(true);
      const payload = {
        deck: {
            ...deckData,
            title: values.title,
            category: values.category,
            description: values.description || "",
            image_url: values.image_url || "",
            is_public: values.privacy === 'public',
            difficulty: values.difficulty
        },
        cards: cards.map(card => ({
            id: card.id,
            front_text: card.front_text,
            back_text: card.back_text,
            transcription: card.transcription,
            image_url: card.image_url,
        }))
      };

      const response = await api.put(`/decks/${deckId}/`, payload);
      
        if (response.status === 200) {
            messageApi.success('Набор успешно обновлен');
            timerRef.current = setTimeout(() => {
            navigate(`/decks/${deckId}`);
            }, 1500);
        }
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      messageApi.error('Ошибка обновления: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
};
  

if (fetching) {
    return (
      <div className={styles.loadContainer}><Spin size="large" tip="Загрузка данных..." /></div>
    );
}

return (
    <div className={styles.mainContainer}>
      {contextHolder}
      <h1 style={{ display: "flex", justifyContent: "center" }}>Редактирование карточного набора</h1>

      <Form<FormValues>
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
      >
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
        
        <Card title="Настройки колоды" className={styles.sectionCard}>
          <Form.Item 
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Пожалуйста, введите название' }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item 
            name="privacy"
            label="Приватность"
            initialValue="private"
            rules={[{ required: true, message: 'Пожалуйста, выберите тип приватности' }]}
          >
            <Radio.Group>
              <Radio value="public">Публичный</Radio>
              <Radio value="private">Приватный</Radio>
            </Radio.Group>
          </Form.Item>
  
          <Form.Item 
            name="image_url"
            label="Ссылка на обложку"
            rules={[{ 
              type: 'url',
              message: 'Пожалуйста, введите корректный URL',
              validator: (_, value) => 
                isValidUrl(value) 
                  ? Promise.resolve() 
                  : Promise.reject('Некорректный URL')
            }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
  
          <Form.Item 
            name="category"
            label="Категория"
            rules={[{ required: true, message: 'Пожалуйста, выберите категорию' }]}
          >
            <Select placeholder="Выберите категорию">
              <Select.Option value="Путешествия">Путешествия</Select.Option>
              <Select.Option value="Культура">Культура</Select.Option>
              <Select.Option value="Еда">Еда</Select.Option>
              <Select.Option value="Быт">Быт</Select.Option>
              <Select.Option value="Животные">Животные</Select.Option>
              <Select.Option value="Другое">Другое</Select.Option>
            </Select>
          </Form.Item>
  
          <Form.Item 
            name="description"
            label="Описание"
          >
            <TextArea rows={3} />
          </Form.Item>
  
          <Form.Item 
            name="difficulty"
            label="Сложность"
            initialValue={3}
          >
            <Rate />
          </Form.Item>
        </Card>

        <Card 
            title="Карточки" 
            className={styles.sectionCard}
          >
            {cards.map((card, index) => (
              <Card 
                key={card.id} 
                title={`Карточка ${index + 1}`}
                className={styles.cardItem}
                actions={[
                  cards.length > 1 && (
                    <DeleteOutlined 
                      key="delete" 
                      onClick={() => removeCard(index)}
                    />
                  )
                ].filter(Boolean) as React.ReactNode[]}
              >
                <Row gutter={[16, 16]} align="top">
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      label="Текст лицевой стороны"
                      required
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Input
                        value={card.front_text}
                        onChange={e => updateCard(index, 'front_text', e.target.value)}
                        placeholder="Текст лицевой стороны"
                      />
                    </Form.Item>
                  </Col>
                    
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item 
                      label="Транскрипция"
                    >
                      <Input
                        value={card.transcription}
                        onChange={e => updateCard(index, 'transcription', e.target.value)}
                        placeholder="Транскрипция"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      label="Текст обратной стороны"
                      required
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Input
                        value={card.back_text}
                        onChange={e => updateCard(index, 'back_text', e.target.value)}
                        placeholder="Текст обратной стороны"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <Form.Item label="Изображение">
                      <Input
                        value={card.image_url}
                        onChange={e => updateCard(index, 'image_url', e.target.value)}
                        placeholder="Ссылка на изображение"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
            <div className={styles.centerContainer}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={addCard}
            >
              Добавить карточку
            </Button>
            </div>
          </Card>
          
  
          <Form.Item className={styles.centerContainer}>
            {contextHolder} 
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              size="large"
              style={{marginBottom: "10px"}}
            >
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
    </div>
  );
};

export default DeckEditing;