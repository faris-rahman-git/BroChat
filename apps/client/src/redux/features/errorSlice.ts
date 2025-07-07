import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: {message: string } = {
  message: "All fields are required",
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    clearError(state) {
      state.message = "All fields are required";
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
