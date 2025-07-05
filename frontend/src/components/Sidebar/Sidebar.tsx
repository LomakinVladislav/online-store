import React, { useState } from 'react';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMenuContext  } from '../../contexts/MenuContext';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <HomeOutlined />, label: 'Главная' },
  { key: '2', icon: <FolderOpenOutlined />, label: 'Ваша библиотека' },
];

const SidebarComponent: React.FC = () => {
  const { selectedMenuKey, setSelectedMenuKey } = useMenuContext();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedMenuKey([e.key]);
    if (e.key === '1') { 
      navigate('/main');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        style={{borderRadius: 10}}
        selectedKeys={selectedMenuKey}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default SidebarComponent;
