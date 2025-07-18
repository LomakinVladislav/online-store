import { Routes } from 'react-router-dom';
import { renderAuthRoutes } from './authRoutes';
import { renderProtectedRoutes } from './protectedRoutes';

export const AppRoutes = ({ isDarkMode, toggleTheme }: { 
  isDarkMode: boolean; 
  toggleTheme: () => void 
}) => (
  <Routes>
    {renderAuthRoutes({ isDarkMode, toggleTheme })}
    {renderProtectedRoutes({ isDarkMode, toggleTheme })}
  </Routes>
);