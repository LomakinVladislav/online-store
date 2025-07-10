import React, { useState, useEffect, useRef } from 'react';
import styles from './DeckCreation.module.css'
import {
  Button,
  Form,
  Input,
  Radio,
  Rate,
  Select,
  message
} from 'antd';
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


const DeckCreation: React.FC = () => {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const onFinish = async (values: FormValues) => {
      try {
        setLoading(true);
        
        const payload = {
          title: values.title,
          category: values.category,
          description: values.description || "",
          image_url: values.image_url || "",
          is_public: values.privacy === 'public',
          difficulty: values.difficulty
        };
  
        const response = await api.post('/decks/', payload);
        
        if (response.status === 200 || response.status === 201) {
            messageApi.success({
                content: 'Ваш набор успешно создан',
                duration: 3,
            });
            form.resetFields();
            timerRef.current = setTimeout(() => {
                navigate(`/deck_content_creation/$`); // Потом заменить на '/decks/${deckID}/creation'
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
      <div>
        <h1>Создание нового карточного набора</h1>
        <Form<FormValues>
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 700 }}
        >
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
  
          {/* Категория */}
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
            <TextArea rows={4} />
          </Form.Item>
  
          <Form.Item 
            name="difficulty"
            label="Сложность"
            initialValue={3}
          >
            <Rate />
          </Form.Item>
  
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {contextHolder}
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              Создать
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  
export default DeckCreation;