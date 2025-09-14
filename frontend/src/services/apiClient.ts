// src/services/apiClient.ts
import axios from 'axios';
import { store } from '../store';
import { setAuth, logout } from '../store/auth/authSlice';


const apiURL = 'https://localhost:3000';
let isRefreshing = false;
let failedRequestsQueue: any[] = [];

const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

// Додаємо токен доступу до заголовка Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const isAuthError = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url.includes('/auth/refresh');

    // Перевіряємо, чи це помилка 401 і чи не є це запитом на оновлення токена
    if (isAuthError && !isRefreshRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log('Access token expired or invalid. Refreshing...');
          const response = await axios.post(
            `${apiURL}/auth/refresh`,
            null,
            { withCredentials: true }
          );
          const { tokens, user } = response.data;
          if (tokens?.accessToken && user) {
            store.dispatch(setAuth({ user, token: tokens.accessToken }));
            // Після успішного оновлення, повторюємо всі запити з черги
            failedRequestsQueue.forEach(promise => promise.resolve(tokens.accessToken));
            failedRequestsQueue = [];
            // Повторюємо поточний запит
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token, logging out.', refreshError);
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Якщо вже відбувається процес оновлення, додаємо запит у чергу
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject: (err: any) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
