import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuth: boolean;
  token: string | null;
}

const getInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token) {
      return {
        user: user ? JSON.parse(user) : null,
        isAuth: true,
        token: token,
      };
    }
    return {
      user: null,
      isAuth: false,
      token: null,
    };
  } catch (e) {
    console.error("Failed to load state from local storage", e);
    return {
      user: null,
      isAuth: false,
      token: null,
    };
  }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuth = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setAuth, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
