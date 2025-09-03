import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
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

const initialState: AuthState = {
  user: null,
  isAuth: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuth = true;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.token = null;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setAuth, logout, setToken } = authSlice.actions;

export default authSlice.reducer;
