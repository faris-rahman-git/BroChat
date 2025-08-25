import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { callListType } from '@bro/shared';

type CallListState = {
  callList: callListType[];
};

const initialState: CallListState = {
  callList: [],
};

const callListSlice = createSlice({
  name: 'callList',
  initialState,
  reducers: {
    setCallList(state, action: PayloadAction<callListType[]>) {
      state.callList = action.payload;
    },
  },
});

export const { setCallList } = callListSlice.actions;

export default callListSlice.reducer;
