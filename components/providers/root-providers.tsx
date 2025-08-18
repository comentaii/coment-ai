'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { GlobalSettingsProvider } from './global-settings-provider';
import { AuthProvider } from './auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/error-boundary';
import { ErrorHandler } from '@/lib/utils/error';

interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  const handleGlobalError = (error: Error, errorInfo: any) => {
    ErrorHandler.logError(error, {
      componentStack: errorInfo.componentStack,
      message: 'Global error boundary caught an error',
    });
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <GlobalSettingsProvider>
              {children}
              <Toaster />
            </GlobalSettingsProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
} 