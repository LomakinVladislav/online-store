import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Form, Input, Layout, Switch, message } from 'antd';
import styles from "./ForgotPassword.module.css";
import api from '../../api/api'

type ForgotPasswordFieldType = {
  email?: string;
};

type ForgotPasswordProps = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isDarkMode, toggleTheme }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm<ForgotPasswordFieldType>();

  const onFinish: FormProps<ForgotPasswordFieldType>['onFinish'] = async (values) => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/forgot_password', {email: values.email}, {skipRedirect: true});

      messageApi.success({
        content: response.data.message || 'Reset link sent successfully',
        duration: 3,
      });
    } catch (error: any) {
      let errorMessage = 'Error sending request';

      if (error.response) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server';
      }

      messageApi.error({
        content: errorMessage,
        duration: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed: FormProps<ForgotPasswordFieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className={styles.logoAndToggleContainer}>
        <div className={styles.themeToggle}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />  
        </div>

        <div 
          className={`${styles.logoContainer} ${
            isDarkMode ? styles.logoContainerDark : styles.logoContainerLight
          }`}
          onClick={() => navigate('/main')}
        >
          <span className={styles.logoText}>Language Trainer</span>
        </div>
      </div>
      
      <div className={styles.authorizationContainer}>
        <h1>Восстановление пароля  </h1>        
        
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <Form
            form={form}
            name="forgotPassword"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<ForgotPasswordFieldType>
              label="Введите ваш email"
              name="email"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите ваш email!' 
                },
                { 
                  type: 'email', 
                  message: 'Пожалуйста, введите корректный email' 
                }
              ]}
              className={styles.formItem}
            >
              <Input className={styles.inputField} />
            </Form.Item>

            <Form.Item className={styles.formItem}>
              {contextHolder}
              <Button 
                type="primary" 
                htmlType="submit" 
                className={styles.submitButton}
                loading={isLoading}
              >
                Отправить
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/auth">Назад к аутентификации</Link>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;