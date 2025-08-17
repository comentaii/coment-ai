'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { GlobalSettingsProvider } from './global-settings-provider';
import { AuthProvider } from './auth-provider';

interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <GlobalSettingsProvider>
            {children}
          </GlobalSettingsProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
} 