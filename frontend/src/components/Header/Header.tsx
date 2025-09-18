import { Layout, Menu, Switch, Input } from 'antd';
import {
  UserOutlined, PlusCircleOutlined, SettingOutlined, LogoutOutlined,
  LoginOutlined, SearchOutlined
} from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { getValidToken } from '../../utils/auth';
import styles from './Header.module.css';
import { HeaderProps, MenuItem } from '@/types';

const { Header: AntdHeader } = Layout;

const HeaderComponent = ({ isDarkMode, toggleTheme }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { activeMenuKey, setActiveMenuKey } = useMenu();
  const token = getValidToken();

  const handleNavigation = useCallback((key: string, path: string) => {
    setActiveMenuKey(key);
    navigate(path);
  }, [setActiveMenuKey, navigate]);

  const handleSearch = useCallback(() => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      navigate(`/search?query=${encodeURIComponent(trimmedValue)}`);
    }
    setSearchValue('')
  }, [searchValue, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const profileMenu = useMemo<MenuItem>(() => {
    const baseItem: MenuItem = {
      key: 'header-profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      children: []
    };

    if (token) {
      baseItem.children = [
        {
          key: 'header-profile-settings',
          icon: <SettingOutlined />,
          label: 'Настройки',
          onClick: () => handleNavigation('header-profile-settings', '/settings'),
        },
        {
          key: 'header-profile-quit',
          icon: <LogoutOutlined />,
          label: 'Выйти',
          onClick: () => {
            localStorage.removeItem('access_token');
            navigate('/auth');
            setActiveMenuKey(null);
          }
        },
      ];
    } else {
      baseItem.children = [
        {
          key: 'header-profile-login',
          icon: <LoginOutlined />,
          label: 'Войти',
          onClick: () => navigate('/auth')
        }
      ];
    }

    return baseItem;
  }, [token, navigate, handleNavigation, setActiveMenuKey]);

  const menuItems = useMemo<MenuItem[]>(() => [
    profileMenu,
    
  ], [profileMenu, handleNavigation, token]);

  return (
    <AntdHeader
      className={styles.header}
    >
      <div className={`${styles.switchContainer} ${isDarkMode
        ? styles.switchContainerDark
        : styles.switchContainerLight
        }`}>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
      </div>

      <div
        className={`${styles.logoContainer} ${isDarkMode
          ? styles.logoContainerDark
          : styles.logoContainerLight
          }`}
        onClick={() => handleNavigation('sidebar-home', '/main')}
      >
        <span className={styles.logoText}>ТехникТорг</span>
      </div>

      <div className={`${styles.searchContainer} ${isDarkMode
        ? styles.searchContainerDark
        : styles.searchContainerLight
        }`}>
        <Input
          placeholder="Поиск техники"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyUp={handleKeyPress}
          suffix={
            <SearchOutlined
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            />
          }
        />
      </div>

      <Menu
        mode="horizontal"
        items={menuItems}
        selectedKeys={activeMenuKey ? [activeMenuKey] : []}
        className={styles.menu}
      />
    </AntdHeader>
  );
};

export default HeaderComponent;