import React, { useState } from 'react';
import './App.module.css';
import { App, ConfigProvider, Layout} from 'antd';
import LayoutComponent from './pages/Layout/Layout';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import Content from './components/Content/Content';


const AppComponent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', (!isDarkMode).toString());
  };
  return (
      <ConfigProvider theme={isDarkMode ? darkThemeConfig : lightThemeConfig}>
        <App> 
          <LayoutComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme} >
            <Content /> 
          </LayoutComponent>  
        </App>
      </ConfigProvider>
)};

export default AppComponent;
