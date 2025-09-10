// src/services/apiClient.ts
import axios from 'axios';
import { store } from '../store';
import { setAuth, logout } from '../store/auth/authSlice';
import {jwtDecode} from "jwt-decode";

const apiClient = axios.create({
  baseURL: 'https://localhost:5173/api',
  withCredentials: true,
});

// Перехоплювач запитів: додає токен доступу до заголовка Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      // Перевіряємо, чи не закінчився термін дії токена
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.warn('Access token expired. Refreshing...');
        // Якщо токен прострочений, ми не додаємо його до запиту,
        // щоб ініціювати 401 помилку для перехоплювача відповідей
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехоплювач відповідей: обробляє помилки 401 і автоматично оновлює токен
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Перевіряємо, чи це помилка 401 і чи не є це запитом на оновлення токена
    // А також, чи не є це повторним запитом
    if (error.response?.status === 401 && originalRequest.url !== '/api/auth/refresh' && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        // Запит на оновлення токена. Браузер автоматично відправить refreshToken у cookie.
        const response = await apiClient.post(
          '/auth/refresh',
          null,
          { withCredentials: true }
        );
        const { tokens, user } = response.data;

        if (tokens?.accessToken && user) {
          store.dispatch(setAuth({ user, token: tokens.accessToken }));
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token, logging out.', refreshError);
        store.dispatch(logout());
        alert('Сесія закінчилась, будь ласка, увійдіть знову.');
        window.location.href = '/login';
      }
    }

    // Якщо помилка не 401 або це вже повторний запит, просто відхиляємо його
    return Promise.reject(error);
  }
);

export default apiClient;
