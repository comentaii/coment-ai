import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import globalSettingsSlice from '@/store/features/globalSettingsSlice';
import uploadSlice from '@/store/features/uploadSlice';
import confirmationSlice from '@/store/features/confirmationSlice'; // Import the new slice
import { baseApi } from '@/services/api/base-api';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['globalSettings'], // Only persist global settings
};

const persistedGlobalSettingsReducer = persistReducer(persistConfig, globalSettingsSlice);

export const store = configureStore({
  reducer: {
    globalSettings: persistedGlobalSettingsReducer,
    upload: uploadSlice,
    confirmation: confirmationSlice, // Add the new reducer
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 