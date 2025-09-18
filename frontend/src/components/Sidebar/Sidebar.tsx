import React, { useState, useMemo, useCallback } from 'react';
import { Button, Menu } from 'antd';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { MenuItem } from '@/types';

const SidebarComponent: React.FC = () => {
  const navigate = useNavigate();
  const { activeMenuKey, setActiveMenuKey } = useMenu();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const handleMenuClick = useCallback((key: string, path: string) => {
    setActiveMenuKey(key);
    navigate(path);
  }, [setActiveMenuKey, navigate]);

  const items: MenuItem[] = useMemo(() => [
    {
      key: 'sidebar-home',
      icon: <HomeOutlined />,
      label: 'Главная',
      onClick: () => handleMenuClick('sidebar-home', '/main')
    },
    
    {
      key: 'sidebar-favorites',
      icon: <StarOutlined />,
      label: 'Корзина',
      onClick: () => handleMenuClick('sidebar-favorites', '/favorites')
    }
  ], [handleMenuClick]);

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