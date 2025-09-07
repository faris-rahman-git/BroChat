import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from 'redux-state-sync';

// Import slices
import loaderSlice from './features/commonSlices/LoaderSlice';
import authSlice from './features/userSlices/authSlices/authSlice';
import errorSlice from './features/userSlices/authSlices/errorSlice';
import userSlice from './features/userSlices/authSlices/userSlice';
import chatListSizeSlice from './features/commonSlices/chatListSizeSlice';
import activeReceiverSlice from './features/userSlices/homeSlices/commonSlices/activeReceiverSlice';
import activeSectionTabSlice from './features/userSlices/homeSlices/commonSlices/activeSectionTabSlice';
import newMessageSlice from './features/userSlices/homeSlices/messageSlice/newMessagesSlice';
import adminSidebarSlice from './features/admin/adminSidebarSlice';
import offlineQueueSlice from './features/socket/offlineQueueSlice';
import browserOnlineSlice from './features/commonSlices/browserOnlineSlice';
import oneToOneChatSlice from './features/userSlices/homeSlices/dmSlices/oneToOneChatSlice';
import groupChatSlice from './features/userSlices/homeSlices/groupSlice/groupChatSlice';
import messageHistorySlice from './features/userSlices/homeSlices/messageSlice/messageHistorySlice';
import messageEditingSlice from './features/userSlices/homeSlices/messageSlice/messageEditingSlice';
import callListSlice from './features/userSlices/homeSlices/callSlices/callListSlice';
import subscriptionPlanSlice from './features/userSlices/homeSlices/commonSlices/subscriptionPlanSlice';
import paymentWindowSlice from './features/userSlices/homeSlices/paymentSlice/paymentWindowSlice';

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'user',
    'chatListSize',
    'offlineQueue',
    'newMessages',
    'paymentWindow',
  ],
  blacklist: ['loader', 'error'],
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  loader: loaderSlice,
  error: errorSlice,
  user: userSlice,
  chatListSize: chatListSizeSlice,
  activeReceiver: activeReceiverSlice,
  activeSectionTab: activeSectionTabSlice,
  newMessages: newMessageSlice,
  adminSidebar: adminSidebarSlice,
  offlineQueue: offlineQueueSlice,
  browserOnlineStatus: browserOnlineSlice,
  oneToOneChat: oneToOneChatSlice,
  groupChat: groupChatSlice,
  messageHistory: messageHistorySlice,
  editingMessage: messageEditingSlice,
  callList: callListSlice,
  subscriptionPlan: subscriptionPlanSlice,
  paymentWindow: paymentWindowSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const syncConfig = {
  whitelist: [
    'paymentWindow/setPaymentInProgress',
    'paymentWindow/setPaymentNotInProgress',
  ],
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(createStateSyncMiddleware(syncConfig)),
});

initStateWithPrevTab(store);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
