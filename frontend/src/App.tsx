import React, { useState } from 'react';
import './App.module.css';
import { App, ConfigProvider } from 'antd';
import LayoutComponent from './components/Layout/Layout';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import DeckContent from './components/DeckContent/DeckContent';
import Main from './pages/Main/Main';
import Authorization from './pages/Authorization/Authorization';
import ExpiredSession from './components/ExpiredSession/ExpiredSession';
import DeckCreation from './pages/DeckCreation/DeckCreation';
import DeckEditing from './pages/DeckEditing/DeckEditing';
import Favorites from './pages/Favorites/Favorites';
import MyDecks from './pages/MyDecks/MyDecks';
import Settings from './pages/Settings/Settings';
import SearchResults from './pages/SearchResults/SearchResults';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

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
        <Routes>
            <Route path="/auth" element={<Authorization isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>} />
            <Route path="/forgot_password" element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>} />
            <Route element={(
              <LayoutComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
                <Outlet /> 
              </LayoutComponent>
            )}>
              <Route path="/main" element={<Main />} />
              <Route path="/decks/:deckId/content" element={<DeckContent />} />
              <Route path="*" element={<Navigate to="/main" />} />
              <Route path="/expired_session" element={<ExpiredSession />} />
              <Route path="/deck_creation" element={<DeckCreation />} />
              <Route path="/decks/:deckId/deck_editing" element={<DeckEditing />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/my_decks" element={<MyDecks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<SearchResults />} />
              {/* <Route path="/profile" element={} /> */}
            </Route>
          </Routes>
        </App>
      </ConfigProvider>
    </Router>
  )
};

export default AppComponent;
