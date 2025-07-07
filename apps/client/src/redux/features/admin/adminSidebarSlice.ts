import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AdminSidebarType = {
  selectedTab: string;
  selectedChild: string | null;
  activeDropdown: string | null;
};

const initialState: AdminSidebarType = {
  selectedTab: 'Dashboard',
  selectedChild: null,
  activeDropdown: 'Dashboard',
};

const adminSidebarSlice = createSlice({
  name: 'adminSidebar',
  initialState,
  reducers: {
    setSelectedTab(state, action: PayloadAction<string>) {
      state.selectedTab = action.payload;
    },
    setSelectedChild(state, action: PayloadAction<string | null>) {
      state.selectedChild = action.payload;
    },
    setActiveDropdown(state, action: PayloadAction<string | null>) {
      state.activeDropdown = action.payload;
    },
  },
});

export const { setSelectedTab, setSelectedChild, setActiveDropdown } =
  adminSidebarSlice.actions;

export default adminSidebarSlice.reducer;
