import React, { useState, useEffect, useRef } from 'react';
import styles from './DeckCreation.module.css'
import { 
  Button, Form, Input, Radio, Rate, Select, message, Card, Row, Col,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../api/api'
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

interface FormValues {
  title: string;
  privacy: 'public' | 'private';
  image_url: string;
  category: string;
  description: string;
  difficulty: number;
}

interface CardType {
  front_text: string;
  back_text: string;
  transcription: string;
  image_url: string;
}

const DeckCreation: React.FC = () => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [cards, setCards] = useState<CardType[]>([
      { front_text: '', back_text: '', image_url: '', transcription: '' }
    ]);  
    
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


    const addCard = () => {
      setCards([...cards, { front_text: '', back_text: '', image_url: '', transcription: '' }]);
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

    const validateCards = (): boolean => {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const errors = [];
        
        if (!card.front_text.trim()) errors.push("Английское слово");
        if (!card.transcription.trim()) errors.push("Транскрипция");
        if (!card.back_text.trim()) errors.push("Перевод");
        if (!card.image_url.trim()) errors.push("Изображение");
        
        if (errors.length > 0) {
          messageApi.error(
            `Заполните обязательные поля в карточке ${i + 1}: ${errors.join(", ")}`
          );
          return false;
        }
        
        if (card.image_url.trim() && !isValidUrl(card.image_url)) {
          messageApi.error(
            `Некорректный URL изображения в карточке ${i + 1}`
          );
          return false;
        }
      }
      return true;
    };
    
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };


    const onFinish = async (values: FormValues) => {
      if (!validateCards()) return;
      
      try {
        setLoading(true);
        
        const payload = {
          deck: {
            title: values.title,
            category: values.category,
            description: values.description || "",
            image_url: values.image_url || "",
            is_public: values.privacy === 'public',
            difficulty: values.difficulty
          },
          cards: cards
        };
  
        const response = await api.post('/decks/', payload);
        
        if (response.status === 200 || response.status === 201) {
            messageApi.success({
                content: 'Ваш набор успешно создан',
                duration: 3,
            });
            form.resetFields();
            setCards([{ front_text: '', back_text: '', image_url: '', transcription: '' }]);
            timerRef.current = setTimeout(() => {
                navigate(`/main`);
            }, 1500);
        }
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data 
          ? (error.response.data as { detail?: string })?.detail || 'Неизвестная ошибка'
          : error.message;
        
        messageApi.error({
            content: 'Ошибка создания. Проверьте правильность заполнения полей',
            duration: 3,
          });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className={styles.mainContainer}>
        {contextHolder}
        <h1 style={{display: "flex", justifyContent: "center"}}>Создание нового карточного набора</h1>

        <Form<FormValues>
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="horizontal" 
        >
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
            rules={[{ type: 'url', message: 'Пожалуйста, введите корректный URL' }]}
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
            label="Теги"
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
                key={index} 
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
                      label="Английское слово"
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Input
                        value={card.back_text}
                        onChange={e => updateCard(index, 'back_text', e.target.value)}
                        placeholder="Слово на иностранном языке"
                      />
                    </Form.Item>
                  </Col>
                    
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item 
                      label="Транскрипция" 
                      rules={[{ required: true, message: 'Обязательное поле' }]}
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
                      label="Перевод"
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Input
                        value={card.front_text}
                        onChange={e => updateCard(index, 'front_text', e.target.value)}
                        placeholder="Слово на русском"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <Form.Item label="Изображение" rules={[{ required: true, message: 'Обязательное поле' }]}>
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
              Создать
            </Button>
          </Form.Item>
        </Form>
        </div>
    );
  };
  
export default DeckCreation;