// paymentSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const paymentWindowSlice = createSlice({
  name: 'paymentWindow',
  initialState: { inProgress: false },
  reducers: {
    setPaymentInProgress: (state) => {
      state.inProgress = true;
    },
    setPaymentNotInProgress: (state) => {
      state.inProgress = false;
    },
  },
});

export const { setPaymentInProgress, setPaymentNotInProgress } =
  paymentWindowSlice.actions;
export default paymentWindowSlice.reducer;
