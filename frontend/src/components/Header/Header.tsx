import { Layout, Menu, Switch} from 'antd';
import { useMenu } from '../../contexts/MenuContext';
import { UserOutlined, PlusCircleOutlined, SettingOutlined, LogoutOutlined, LoginOutlined  } from '@ant-design/icons';
import styles from './Header.module.css'
import { useNavigate } from 'react-router-dom';
import { getValidToken } from '../../utils/auth';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';


type HeaderProps = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  children?: MenuItem[];
}

const { Header } = Layout;

const HeaderComponent = ({ isDarkMode, toggleTheme }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { activeMenuKey, setActiveMenuKey } = useMenu();

  const handleNavigation = (key: string, path: string) => {
    setActiveMenuKey(key);
    navigate(path);
  };
  const token = getValidToken();

  const profileMenu: MenuItem = {
    key: 'header-profile',
    icon: <UserOutlined />,
    label: 'Профиль',
    children: []
  };

  if (token) {
    profileMenu.children = [
      { 
        key: 'header-profile-settings', 
        icon: <SettingOutlined />, 
        label: 'Настройки',
        onClick: () => handleNavigation('header-profile', '/settings'),
      },
      { 
        key: 'header-profile-quit', 
        icon: <LogoutOutlined />, 
        label: 'Выйти',
        onClick: () => {
          localStorage.removeItem('access_token');
          navigate('/auth');
        }
      },
    ];
  } else {
    profileMenu.children = [
      { 
        key: 'header-profile-login', 
        icon: <LoginOutlined />, 
        label: 'Войти',
        onClick: () => navigate('/auth')
      }
    ];
  }

  const items: MenuItem[] = [
    profileMenu,
    {
      key: 'header-create',
      icon: <PlusCircleOutlined />,
      label: 'Создать',
      onClick: () => handleNavigation('header-create', '/deck_creation')
    }
  ];

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      navigate(`/search?query=${encodeURIComponent(trimmedValue)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: 0, // Без этого свойства с width: 100% элемент не помещается в рамки родителя
        }}
      >
      <div className={`${styles.switchContainer} ${
        isDarkMode ? styles.switchContainerDark : styles.switchContainerLight
      }`}>
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
        onClick={() => handleNavigation('sidebar-home', '/main')}
      >
        <span className={styles.logoText}>Language Trainer</span>
      </div>

      {/* Поисковая строка */}
      <div className={`${styles.searchContainer} ${
        isDarkMode ? styles.searchContainerDark : styles.searchContainerLight
      }`}>
        <Input
          placeholder="Поиск колод"
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
          defaultSelectedKeys={['1']}
          items={items}
          selectedKeys={activeMenuKey ? [activeMenuKey] : []}
          style={{ flex: 1, flexDirection: `row-reverse` , minWidth: 0}}
        />
      </Header>
  );
};

export default HeaderComponent;