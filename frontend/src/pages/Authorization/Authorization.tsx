import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Switch, Layout, message, Space } from 'antd';
import styles from "./Authorization.module.css"
import axios from 'axios';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

type AuthorizationProps = {
    isDarkMode: boolean;
    toggleTheme: () => void;
  };
  

const Authorization: React.FC<AuthorizationProps> = ({ isDarkMode, toggleTheme }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
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
    
        
    return (
    <Layout style={{ height: "100vh" }}>
        <div className={styles.themeToggle}>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
        </div>
      
        <div className={styles.authorizationContainer}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>    
            </Form.Item>

            <Form.Item label={null}>
              {contextHolder}
                <Button type="primary" htmlType="submit" >
                    Submit
                </Button>
            </Form.Item>
        </Form>
        </div>
    </Layout>
)};

export default Authorization;