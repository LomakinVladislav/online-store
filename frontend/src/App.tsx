import React, { useState } from 'react';
import './App.module.css';
import { App, ConfigProvider } from 'antd';
import LayoutComponent from './components/Layout/Layout';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import DeckContent from './components/DeckContent/DeckContent';
import Main from './pages/Main/Main'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const AppComponent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'true'; 
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', (!isDarkMode).toString());
  };
  return (
    <Router>
      <ConfigProvider theme={isDarkMode ? darkThemeConfig : lightThemeConfig}>
        <App>
          <LayoutComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme} >
            <Routes>
              {/* <Route path="/main" element={} /> */}
              {/* <Route path="/profile" element={} /> */}
              {/* <Route path="/settings" element={} /> */}
              {/* <Route path="/search" element={} /> */}
              {/* <Route path="/library" element={} /> */}
              {/* <Route path="/newdeck" element={} /> */}
              (<Route path="*" element={<Navigate to="/main" />} />)
              <Route path="/main" element={<Main />} />
              <Route path="/content" element={<DeckContent />} />
            </Routes>
          </LayoutComponent>
        </App>
      </ConfigProvider>
    </Router>
  )
};

export default AppComponent;
