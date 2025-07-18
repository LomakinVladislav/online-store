import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Form, Input, Layout, Switch, message } from 'antd';
import styles from "./ResetPassword.module.css";
import api from '../../api/api';

type ResetPasswordFieldType = {
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordProps = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ isDarkMode, toggleTheme }) => {
  const [form] = Form.useForm<ResetPasswordFieldType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      
      try {
        await api.get(`/auth/validate_reset_token?reset_token=${token}`, {
            skipRedirect: true
        });
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        console.error('Ошибка валидации токена:', error);
      }
    };
    
    validateToken();
  }, [token]);

  const onFinish: FormProps<ResetPasswordFieldType>['onFinish'] = async (values) => {
    setIsLoading(true);
    
    try {
      await api.post('/auth/reset_password', {
        token,
        new_password: values.newPassword
      }, {skipRedirect: true});
      
      messageApi.success({
        content: 'Пароль успешно изменен! Перенаправляем на страницу входа...',
        duration: 2,
      });
      
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error: any) {
      let errorMessage = 'Ошибка при сбросе пароля';

      if (error.response) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Сервер не отвечает';
      }

      messageApi.error({
        content: errorMessage,
        duration: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed: FormProps<ResetPasswordFieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (tokenValid === null) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <div className={styles.authorizationContainer}>
          <div className="text-center p-8">Проверка токена...</div>
        </div>
      </Layout>
    );
  }

  if (!tokenValid) {
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
          <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#ff4d4f' }}>Недействительный токен</h2>
            <p>Ссылка для сброса пароля недействительна или срок ее действия истек.</p>
            
            <Button 
              type="primary" 
              onClick={() => navigate('/forgot_password')}
              className={styles.submitButton}
              style={{ marginTop: '20px' }}
            >
              Запросить новую ссылку
            </Button>
            
            <div style={{ marginTop: '16px' }}>
              <Link to="/auth">Вернуться к аутентификации</Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
        <h1>Сброс пароля</h1>
        
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {contextHolder}
          <Form
            form={form}
            name="resetPassword"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<ResetPasswordFieldType>
              label="Новый пароль"
              name="newPassword"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите новый пароль!' 
                },
                { 
                  min: 6, 
                  message: 'Пароль должен быть не менее 6 символов' 
                }
              ]}
              className={styles.formItem}
            >
              <Input.Password className={styles.inputField} />
            </Form.Item>

            <Form.Item<ResetPasswordFieldType>
              label="Подтвердите пароль"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, подтвердите пароль!' 
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
              ]}
              className={styles.formItem}
            >
              <Input.Password className={styles.inputField} />
            </Form.Item>

            <Form.Item className={styles.formItem}>
              <Button 
                type="primary" 
                htmlType="submit" 
                className={styles.submitButton}
                loading={isLoading}
              >
                Обновить пароль
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/auth">Вернуться к аутентификации</Link>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;