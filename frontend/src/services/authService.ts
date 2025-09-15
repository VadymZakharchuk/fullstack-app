// src/services/authService.ts
import type { LoginFormData } from '../pages/login-page/LoginPage.tsx';
import { setAuth } from "../store/auth/authSlice.ts";
import type { AppDispatch } from "../store";
import axios from 'axios';

const baseURL =  'https://localhost:3000';
const api = axios.create({
  baseURL,
  withCredentials: true, // Додай цей рядок
});

export const login = async (data: LoginFormData, dispatch: AppDispatch) => {
  try {
    const response = await api.post(`${baseURL}/auth/login`, {
      email: data.email,
      password: data.password,
    });
    const { tokens, user } = response.data;
    if (tokens.accessToken) {
      dispatch(setAuth({ user: user, token: tokens.accessToken }));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login error');
    }
    throw new Error('Unknown error');
  }
};

export const registerUser = async (data: LoginFormData) => {
  try {
    const response = await api.post(`${baseURL}/auth/register`, {
      email: data.email,
      password: data.password,
      name: data.name,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Register error');
    }
    throw new Error('Unknown error');
  }
};
