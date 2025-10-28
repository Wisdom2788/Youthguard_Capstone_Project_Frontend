
import axios from 'axios';
import { AuthTokens } from '../types';

// Use environment variable for API URL, with a fallback for local development.
const API_URL = process.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokensString = localStorage.getItem('authTokens');
    if (tokensString) {
      const tokens: AuthTokens = JSON.parse(tokensString);
      if (tokens.access) {
        config.headers.Authorization = `JWT ${tokens.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const tokensString = localStorage.getItem('authTokens');
      if (!tokensString) return Promise.reject(error);

      const { refresh } = JSON.parse(tokensString) as AuthTokens;
      if (!refresh) return Promise.reject(error);

      try {
        const { data } = await axios.post<AuthTokens>(`${API_URL}/api/auth/jwt/refresh/`, { refresh });
        localStorage.setItem('authTokens', JSON.stringify(data));

        api.defaults.headers.common['Authorization'] = `JWT ${data.access}`;
        originalRequest.headers['Authorization'] = `JWT ${data.access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('authTokens');
        // This is a simple way to force a re-login. A more robust solution might use a redirect via the auth context.
        window.location.hash = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
