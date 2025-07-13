import React, { useState } from 'react';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMenu  } from '../../contexts/MenuContext';

const SidebarComponent: React.FC = () => {
  const navigate = useNavigate();
  const { activeMenuKey, setActiveMenuKey } = useMenu();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (key: string, path: string) => {
    setActiveMenuKey(key);
    navigate(path);
  };

  const items = [
    {
      key: 'sidebar-home',
      icon: <HomeOutlined />,
      label: 'Главная',
      onClick: () => handleMenuClick('sidebar-home', '/main')
    },
    {
      key: 'sidebar-created_decks',
      icon: <BookOutlined />,
      label: 'Мои колоды',
      onClick: () => handleMenuClick('sidebar-created_decks', '/created_decks')
    },
    {
      key: 'sidebar-favorites',
      icon: <StarOutlined />,
      label: 'Избранное',
      onClick: () => handleMenuClick('sidebar-favorites', '/favorites')
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        style={{borderRadius: 10}}
        selectedKeys={activeMenuKey ? [activeMenuKey] : []}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default SidebarComponent;
