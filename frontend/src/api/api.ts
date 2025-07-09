import axios from 'axios';
import { getValidToken } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

const redirectToWarning = () => {
  localStorage.removeItem('access_token');
  if (window.location.pathname !== '/expired_session') {
    window.location.href = '/expired_session';
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      redirectToWarning();
      return new Promise(() => {});
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToWarning();
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;