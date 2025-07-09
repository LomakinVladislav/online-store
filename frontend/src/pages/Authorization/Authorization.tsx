import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Switch, Layout, message, Space, Radio } from 'antd';
import styles from "./Authorization.module.css"
import axios from 'axios';

type LoginFieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

type RegisterFieldType = {
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
  confirmPassword?: string;
};

type AuthorizationProps = {
    isDarkMode: boolean;
    toggleTheme: () => void;
  };
  

  const Authorization: React.FC<AuthorizationProps> = ({ isDarkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [loginForm] = Form.useForm<LoginFieldType>();
    const [registerForm] = Form.useForm<RegisterFieldType>();

    const onFinishFailed: FormProps<LoginFieldType | RegisterFieldType>['onFinishFailed'] = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const onFinishLogin: FormProps<LoginFieldType>['onFinish'] = async (values) => {
      try {
        const formData = new URLSearchParams();
        formData.append('username', values.username || '');
        formData.append('password', values.password || '');
  
        const response = await axios.post(
          'http://127.0.0.1:8000/auth/token',
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
  
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/main');
        
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        messageApi.error({
          content: 'Ошибка авторизации. Проверьте данные',
          duration: 3,
        });
      }
    };


    const onFinishRegister: FormProps<RegisterFieldType>['onFinish'] = async (values) => {
      try {
        if (values.password !== values.confirmPassword) {
          messageApi.error({
            content: 'Пароли не совпадают',
            duration: 3,
          });
          return;
        }
  
        await axios.post(
          'http://127.0.0.1:8000/users',
          {
            username: values.username,
            email: values.email,
            full_name: values.full_name,
            password: values.password,
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        messageApi.success({
          content: 'Регистрация прошла успешно! Теперь войдите в систему',
          duration: 3,
        });
        
        setFormType('login');
        registerForm.resetFields();
        
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        
        let errorMessage = 'Ошибка регистрации';

        if (axios.isAxiosError(error)) {
      if (error.response) {
        const responseData = error.response.data;
        
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.detail) {
          if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
          } else if (Array.isArray(responseData.detail)) {
            errorMessage = responseData.detail
              .map((err: any) => err.msg || `Ошибка в поле ${err.loc.join('.')}: ${err.msg}`)
              .join('; ');
          } else {
            errorMessage = JSON.stringify(responseData.detail);
          }
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else {
          errorMessage = `Ошибка сервера: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Сервер не отвечает';
      } else {
        errorMessage = 'Ошибка при отправке запроса';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    messageApi.error({
      content: errorMessage,
      duration: 3,
    });
  }
};
    
      
    const handleFormSwitch = (type: 'login' | 'register') => {
      setFormType(type);
      loginForm.resetFields();
      registerForm.resetFields();
    };


    return (
      <Layout style={{ minHeight: "100vh" }}>
      <div className={styles.themeToggle}>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
      </div>
      <div className={styles.authorizationContainer}>
        <h1>{formType === 'login' ? 'Вход' : 'Регистрация'}</h1>
        
        <div className={styles.formSwitcher}>
          <Radio.Group
            value={formType}
            onChange={(e) => handleFormSwitch(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="login">Войти</Radio.Button>
            <Radio.Button value="register">Зарегистрироваться</Radio.Button>
          </Radio.Group>
        </div>

        {/* Форма авторизации */}
        <div 
          style={{ 
            display: formType === 'login' ? 'block' : 'none',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          <Form
            form={loginForm}
            name="login"
            layout="vertical" 
            initialValues={{ remember: true }}
            onFinish={onFinishLogin}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<LoginFieldType>
              label="Имя пользователя"
              name="username"
              rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}
              className={styles.formItem} 
            >
              <Input className={styles.inputField} />
            </Form.Item>

            <Form.Item<LoginFieldType>
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
              className={styles.formItem}
            >
              <Input.Password className={styles.inputField} />
            </Form.Item>

            <Form.Item<LoginFieldType> 
              name="remember" 
              valuePropName="checked" 
              className={styles.formItem}
            >
              <Checkbox>Запомнить меня</Checkbox>    
            </Form.Item>

            <Form.Item className={styles.formItem}>
              {contextHolder}
              <Button type="primary" htmlType="submit" className={styles.submitButton}>
                Войти
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Форма регистрации */}
        <div 
          style={{ 
            display: formType === 'register' ? 'block' : 'none',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          <Form
            form={registerForm}
            name="register"
            layout="vertical" 
            initialValues={{ remember: true }}
            onFinish={onFinishRegister}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<RegisterFieldType>
              label="Имя пользователя"
              name="username"
              rules={[{ 
                required: true, 
                message: 'Пожалуйста, введите имя пользователя!',
                min: 3,
                max: 50
              }]}
              className={styles.formItem}
            >
              <Input className={styles.inputField} />
            </Form.Item>

            <Form.Item<RegisterFieldType>
              label="Email"
              name="email"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите email!' 
                },
                { 
                  type: 'email', 
                  message: 'Некорректный email адрес' 
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<RegisterFieldType>
              label="Полное имя"
              name="full_name"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите ваше имя!' 
                },
                { 
                  min: 2, 
                  message: 'Имя должно быть не менее 2 символов' 
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<RegisterFieldType>
              label="Пароль"
              name="password"
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, введите пароль!' 
                },
                { 
                  min: 6, 
                  message: 'Пароль должен быть не менее 6 символов' 
                }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<RegisterFieldType>
              label="Подтверждение пароля"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { 
                  required: true, 
                  message: 'Пожалуйста, подтвердите пароль!' 
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item className={styles.formItem}>
              {contextHolder}
              <Button type="primary" htmlType="submit" className={styles.submitButton}>
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
)};

export default Authorization;