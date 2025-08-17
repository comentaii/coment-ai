import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import globalSettingsSlice from './features/globalSettingsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['globalSettings'], // Only persist global settings
};

const persistedGlobalSettingsReducer = persistReducer(persistConfig, globalSettingsSlice);

export const store = configureStore({
  reducer: {
    globalSettings: persistedGlobalSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 