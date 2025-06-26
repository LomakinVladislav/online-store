import React, { useState } from 'react';
import styles from './App.module.css';
import Layout from './pages/Layout/Layout';
import { App, ConfigProvider} from 'antd';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';



const AppComponent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', (!isDarkMode).toString());
  };
  return (
      <ConfigProvider theme={isDarkMode ? darkThemeConfig : lightThemeConfig}>
        <App> 
          <div className={styles[`app-window`]}>
            <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>  
          </div>
        </App>
      </ConfigProvider>
)};

export default AppComponent;
