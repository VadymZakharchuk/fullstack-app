import axios from 'axios';
import type { LoginFormData } from '../pages/LoginPage';
import {setAuth} from "../store/auth/authSlice.ts";
import type { AppDispatch } from "../store";

const API_URL = 'http://localhost:3000/auth';

export const login = async (data: LoginFormData, dispatch: AppDispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: data.email,
      password: data.password,
    });
    const { access_token, user } = response.data;
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      dispatch(setAuth({ user: user, token: access_token }));
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
    const response = await axios.post(`${API_URL}/register`, {
      email: data.email,
      password: data.password,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {

      throw new Error(error.response.data.message || 'Register error');
    }
    throw new Error('Unknown error');
  }
};
