import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import loaderSlice from './features/LoaderSlice';
import authSlice from './features/authSlice';
import errorSlice from './features/errorSlice';
import userSlice from './features/userSlice';
import chatListSizeSlice from './features/chatListSizeSlice';
import activeReceiverSlice from './features/activeReceiverSlice';
import activeSectionTabSlice from './features/activeSectionTabSlice';
import newMessageSlice from './features/newMessagesSlice';
import adminSidebarSlice from './features/admin/adminSidebarSlice';
import offlineQueueSlice from './features/socket/offlineQueueSlice';
import browserOnlineSlice from './features/browserOnlineSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'chatListSize', 'offlineQueue', 'newMessages'], // only persist the 'auth' slice
  blacklist: ['loader', 'error'], // do not persist this slice
};

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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state checks
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
