import React, { useState } from 'react';
import './App.module.css';
import { App as AntdApp, ConfigProvider } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import { AppRoutes } from './routes';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'true'; 
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode.toString());
  };

  return (
    <Router>
      <ConfigProvider theme={isDarkMode ? darkThemeConfig : lightThemeConfig}>
        <AntdApp>
          <AppRoutes isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </AntdApp>
      </ConfigProvider>
    </Router>
  );
};

export default App;