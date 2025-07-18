import { Route } from 'react-router-dom';
import Authorization from '../pages/Authorization/Authorization';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';

export const renderAuthRoutes = ({ isDarkMode, toggleTheme }: { 
  isDarkMode: boolean; 
  toggleTheme: () => void 
}) => [
  <Route 
    key="auth"
    path="/auth" 
    element={<Authorization isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
  />,
  <Route 
    key="forgot"
    path="/forgot_password" 
    element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
  />,
  <Route 
    key="reset"
    path="/reset_password" 
    element={<ResetPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
  />
];