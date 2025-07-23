import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const chatListSizeSlice = createSlice({
  name: 'chatListSize',
  initialState: {
    size: 350, 
  },
  reducers: {
    setChatListSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const { setChatListSize } = chatListSizeSlice.actions;
export default chatListSizeSlice.reducer;
