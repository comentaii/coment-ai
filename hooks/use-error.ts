import { useCallback, useState } from 'react';
import { useToast } from './use-toast';
import { toastMessages } from '@/lib/utils/toast';

export interface ErrorInfo {
  componentStack?: string;
  message?: string;
  stack?: string;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
}

export const useError = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    fallbackMessage = toastMessages.serverError,
    onError,
  } = options;

  const { error: showErrorToast } = useToast();
  const [lastError, setLastError] = useState<Error | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = useCallback((
    error: Error | string,
    errorInfo?: ErrorInfo,
    customMessage?: string
  ) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Update state
    setLastError(errorObj);
    setErrorCount(prev => prev + 1);

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error caught by useError:', {
        error: errorObj,
        errorInfo,
        timestamp: new Date().toISOString(),
      });
    }

    // Show toast if enabled
    if (showToast) {
      const message = customMessage || errorObj.message || fallbackMessage;
      showErrorToast(message);
    }

    // Call custom error handler
    onError?.(errorObj, errorInfo);

    return errorObj;
  }, [showToast, logToConsole, fallbackMessage, onError, showErrorToast]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorInfo?: ErrorInfo,
    customMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, errorInfo, customMessage);
      return null;
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setLastError(null);
    setErrorCount(0);
  }, []);

  const isError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    return errorObj instanceof Error;
  }, []);

  const getErrorMessage = useCallback((error: Error | string) => {
    if (typeof error === 'string') {
      return error;
    }
    return error.message || fallbackMessage;
  }, [fallbackMessage]);

  // Common error handlers
  const handleNetworkError = useCallback((error: Error) => {
    handleError(error, undefined, toastMessages.networkError);
  }, [handleError]);

  const handleValidationError = useCallback((error: Error) => {
    handleError(error, undefined, toastMessages.validationError);
  }, [handleError]);

  const handleAuthError = useCallback((error: Error) => {
    handleError(error, undefined, toastMessages.loginError);
  }, [handleError]);

  const handleApiError = useCallback((error: Error, endpoint?: string) => {
    const message = endpoint 
      ? `${endpoint} endpoint'inde hata oluştu`
      : toastMessages.serverError;
    handleError(error, undefined, message);
  }, [handleError]);

  return {
    // State
    lastError,
    errorCount,
    
    // Core functions
    handleError,
    handleAsyncError,
    clearError,
    
    // Utility functions
    isError,
    getErrorMessage,
    
    // Common error handlers
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleApiError,
  };
};
