import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const subscriptionPlanSlice = createSlice({
  name: 'subscriptionPlan',
  initialState: {
    value: false,
  },
  reducers: {
    setShowSubscriptionPlans(state, action: PayloadAction<{ value: boolean }>) {
      state.value = action.payload.value;
    },
  },
});

export const { setShowSubscriptionPlans } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
