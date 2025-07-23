import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  isLoading: boolean;
};

const initialState: User = {
  id: null,
  name: null,
  email: null,
  role: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User }>) {
      state.id = action.payload.user.id;
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      state.role = action.payload.user.role ?? null;
    },
    logout(state) {
      state.id = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<{ loading: boolean }>) {
      state.isLoading = action.payload.loading;
    },
  },
});

export const { setUser, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
