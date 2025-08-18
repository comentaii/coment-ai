import { toastMessages } from './toast';

export interface ErrorInfo {
  componentStack?: string;
  message?: string;
  stack?: string;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export class ErrorHandler {
  private static errorLog: Array<{ error: Error; info: ErrorInfo }> = [];

  static logError(error: Error, info?: Partial<ErrorInfo>) {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      ...info,
    };

    // Add to local log
    this.errorLog.push({ error, info: errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', { error, info: errorInfo });
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // this.sendToErrorService(error, errorInfo);

    return errorInfo;
  }

  static getErrorLog() {
    return [...this.errorLog];
  }

  static clearErrorLog() {
    this.errorLog = [];
  }

  static isNetworkError(error: Error): boolean {
    return (
      error.name === 'NetworkError' ||
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('connection')
    );
  }

  static isValidationError(error: Error): boolean {
    return (
      error.name === 'ValidationError' ||
      error.message.includes('validation') ||
      error.message.includes('invalid')
    );
  }

  static isAuthError(error: Error): boolean {
    return (
      error.name === 'AuthError' ||
      error.message.includes('auth') ||
      error.message.includes('login') ||
      error.message.includes('unauthorized')
    );
  }

  static isApiError(error: Error): boolean {
    return (
      error.name === 'ApiError' ||
      error.message.includes('api') ||
      error.message.includes('server') ||
      error.message.includes('500') ||
      error.message.includes('404')
    );
  }

  static getErrorMessage(error: Error): string {
    if (this.isNetworkError(error)) {
      return toastMessages.networkError;
    }
    
    if (this.isValidationError(error)) {
      return toastMessages.validationError;
    }
    
    if (this.isAuthError(error)) {
      return toastMessages.loginError;
    }
    
    if (this.isApiError(error)) {
      return toastMessages.serverError;
    }

    return error.message || toastMessages.serverError;
  }

  static createError(message: string, name?: string, stack?: string): Error {
    const error = new Error(message);
    if (name) error.name = name;
    if (stack) error.stack = stack;
    return error;
  }

  static async withErrorHandling<T>(
    asyncFn: () => Promise<T>,
    errorInfo?: Partial<ErrorInfo>
  ): Promise<T | null> {
    try {
      return await asyncFn();
    } catch (error) {
      this.logError(error as Error, errorInfo);
      return null;
    }
  }

  static withErrorBoundary<T>(
    fn: () => T,
    errorInfo?: Partial<ErrorInfo>
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.logError(error as Error, errorInfo);
      return null;
    }
  }
}

// Common error types
export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Validation error occurred') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message = 'Authentication error occurred') {
    super(message);
    this.name = 'AuthError';
  }
}

export class ApiError extends Error {
  constructor(message = 'API error occurred', public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error constants
export const ERROR_TYPES = {
  NETWORK: 'NetworkError',
  VALIDATION: 'ValidationError',
  AUTH: 'AuthError',
  API: 'ApiError',
  UNKNOWN: 'UnknownError',
} as const;

export const ERROR_MESSAGES = {
  ...toastMessages,
  // Additional error messages
  componentError: 'Component yüklenirken hata oluştu',
  pageError: 'Sayfa yüklenirken hata oluştu',
  dataError: 'Veri yüklenirken hata oluştu',
  permissionError: 'Bu işlem için yetkiniz bulunmuyor',
  timeoutError: 'İşlem zaman aşımına uğradı',
  quotaError: 'İşlem kotası doldu',
} as const;
