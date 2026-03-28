import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const isAiSuggest = config.url?.includes('/ai/suggest');
  if (typeof window !== 'undefined' && !isAiSuggest) {
    window.dispatchEvent(new CustomEvent('start-loading'));
  }
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const isAiSuggest = response.config.url?.includes('/ai/suggest');
    if (typeof window !== 'undefined' && !isAiSuggest) {
      window.dispatchEvent(new CustomEvent('stop-loading'));
    }
    return response;
  },
  (error) => {
    const isAiSuggest = error.config?.url?.includes('/ai/suggest');
    if (typeof window !== 'undefined' && !isAiSuggest) {
      window.dispatchEvent(new CustomEvent('stop-loading'));
    }
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
