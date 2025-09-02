import axios from 'axios';
import type {LoginFormData} from '../pages/LoginPage';

const API_URL = 'http://localhost:3000/auth';

export const login = async (data: LoginFormData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: data.email,
      password: data.password,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {

      throw new Error(error.response.data.message || 'Помилка входу');
    }
    throw new Error('Сталася невідома помилка');
  }
};
