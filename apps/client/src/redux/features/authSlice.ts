import { RegisterData } from "@client/types/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: RegisterData = {
  name: null,
  email: null,
  phoneNumber: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // For registration
    setRegisterData: (state, action: PayloadAction<RegisterData>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },

    clearRegisterData: () => {
      return initialState;
    },
  },
});

export const { setRegisterData, clearRegisterData } = authSlice.actions;

export default authSlice.reducer;
