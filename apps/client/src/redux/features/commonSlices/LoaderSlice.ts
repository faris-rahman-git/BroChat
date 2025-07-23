import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    status: false,
  },
  reducers: {
    showLoader: (state) => {
      state.status = true;
    },
    hideLoader: (state) => {
      state.status = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
