import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BrowserOnlineType = {
  isOnline: boolean;
};

const initialState: BrowserOnlineType = {
  isOnline: navigator.onLine,
};

const browserOnlineSlice = createSlice({
  name: 'browserOnlineStatus',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnline } = browserOnlineSlice.actions;
export default browserOnlineSlice.reducer;
