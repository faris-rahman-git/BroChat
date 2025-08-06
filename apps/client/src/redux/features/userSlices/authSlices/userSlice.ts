import { UserReduxType } from '@client/types/ReduxTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProfileUpdateInfoParams,
  SubscriptionDetailsType,
  userDetailsType,
} from '@bro/shared';

const initialState: UserReduxType = {
  id: null,
  name: null,
  email: null,
  role: null,
  isLoading: false,
  isSubscribed: false,
  subscriptionPlan: null,
  subscriptionStart: null,
  subscriptionEnd: null,
  username: null,
  phoneNumber: null,
  avatar: null,
  about: null,
  blockedUsers: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: userDetailsType }>) {
      state.id = action.payload.user.id;
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      state.role = action.payload.user.role ?? null;
      state.isSubscribed = action.payload.user.isSubscribed ?? false;
      state.subscriptionPlan = action.payload.user.subscriptionPlan ?? null;
      state.subscriptionStart = action.payload.user.subscriptionStart ?? null;
      state.subscriptionEnd = action.payload.user.subscriptionEnd ?? null;
      state.username = action.payload.user.username ?? null;
      state.phoneNumber = action.payload.user.phoneNumber ?? null;
      state.avatar = action.payload.user.avatar ?? null;
      state.about = action.payload.user.about ?? null;
      state.blockedUsers = action.payload.user.blockedUsers ?? null;
    },
    logout(state) {
      state.id = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.isLoading = false;
      state.isSubscribed = false;
      state.subscriptionPlan = null;
      state.subscriptionStart = null;
      state.subscriptionEnd = null;
      state.username = null;
      state.phoneNumber = null;
      state.avatar = null;
      state.about = null;
      state.blockedUsers = null;
    },
    setLoading(state, action: PayloadAction<{ loading: boolean }>) {
      state.isLoading = action.payload.loading;
    },
    updateSubscriptionDetails(
      state,
      action: PayloadAction<{ data: SubscriptionDetailsType }>
    ) {
      state.isSubscribed = action.payload?.data?.isSubscribed;
      state.subscriptionPlan = action.payload?.data?.subscriptionPlan;
      state.subscriptionStart = action.payload?.data?.subscriptionStart;
      state.subscriptionEnd = action.payload?.data?.subscriptionEnd;
    },
    updateProfileInfo(
      state,
      action: PayloadAction<{ profileData: ProfileUpdateInfoParams }>
    ) {
      state.name = action.payload.profileData.name;
      state.username = action.payload.profileData.username;
      state.phoneNumber = action.payload.profileData.phoneNumber ?? null;
      state.avatar = action.payload.profileData.avatar;
      state.about = action.payload.profileData.about;
    },
  },
});

export const {
  setUser,
  logout,
  setLoading,
  updateSubscriptionDetails,
  updateProfileInfo,
} = userSlice.actions;
export default userSlice.reducer;
