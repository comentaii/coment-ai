'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { GlobalSettingsProvider } from './global-settings-provider';
import { AuthProvider } from './auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/error-boundary';
import { ErrorHandler } from '@/lib/utils/error';
import { UploadProgressTracker } from '@/components/ui/upload-progress-tracker';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { useSocket } from '@/hooks/useSocket';

// A new component to initialize the socket connection globally
function SocketInitializer() {
  useSocket(); // This will establish the connection when the app loads
  return null; // This component doesn't render anything
}

interface RootProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function RootProviders({ children, messages, locale }: RootProvidersProps) {
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
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AuthProvider>
                        <GlobalSettingsProvider>
                            <SocketInitializer />
                            {children}
                            <UploadProgressTracker />
                        </GlobalSettingsProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </PersistGate>
        </Provider>
    </ErrorBoundary>


  );
} 