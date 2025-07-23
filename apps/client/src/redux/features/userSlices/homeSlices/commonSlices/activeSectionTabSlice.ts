import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const activeSectionTabSlice = createSlice({
  name: 'activeSectionTab',
  initialState:{
    value: 'DMs',
  },
  reducers: {
    setActiveSection(state, action: PayloadAction<{ value: string }>) {
      state.value = action.payload.value;
    },
  },
});

export const { setActiveSection } = activeSectionTabSlice.actions;
export default activeSectionTabSlice.reducer;
