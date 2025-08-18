# Error Handling Kılavuzu

Bu dokümantasyon, Coment-AI projesinde global error handling sisteminin nasıl kullanılacağını açıklar.

## Kurulum

Error handling sistemi otomatik olarak `RootProviders` içinde kurulmuştur. Herhangi bir ek kurulum gerektirmez.

## Bileşenler

### 1. Error Boundary

Global error boundary tüm uygulamayı sarar ve beklenmeyen hataları yakalar.

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

// Custom error boundary
<ErrorBoundary 
  onError={(error, errorInfo) => {
    console.error('Custom error handler:', error, errorInfo);
  }}
  fallback={<CustomErrorComponent />}
>
  <YourApp />
</ErrorBoundary>
```

### 2. Error Hook

React component'lerde error handling için hook.

```typescript
import { useError } from '@/hooks/use-error';

function MyComponent() {
  const { 
    handleError, 
    handleAsyncError, 
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleApiError,
    lastError,
    errorCount,
    clearError 
  } = useError({
    showToast: true,
    logToConsole: true,
    fallbackMessage: 'Bir hata oluştu',
    onError: (error, errorInfo) => {
      // Custom error handler
    }
  });

  // Kullanım örnekleri...
}
```

### 3. Error Utility

Component dışında kullanım için utility fonksiyonları.

```typescript
import { ErrorHandler, NetworkError, ValidationError, ApiError } from '@/lib/utils/error';

// Error logging
ErrorHandler.logError(error, { userId: '123', url: '/dashboard' });

// Error type checking
if (ErrorHandler.isNetworkError(error)) {
  // Handle network error
}

// Error message generation
const message = ErrorHandler.getErrorMessage(error);

// Async error handling
const result = await ErrorHandler.withErrorHandling(async () => {
  return await fetch('/api/data');
});
```

## Kullanım Yöntemleri

### 1. React Hook Kullanımı

#### **Basit Error Handling:**
```typescript
const { handleError } = useError();

const handleClick = () => {
  try {
    // Risky operation
    throw new Error('Something went wrong');
  } catch (error) {
    handleError(error);
  }
};
```

#### **Async Error Handling:**
```typescript
const { handleAsyncError } = useError();

const fetchData = async () => {
  const result = await handleAsyncError(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('API error');
      }
      return response.json();
    },
    undefined,
    'Veri yüklenirken hata oluştu'
  );

  if (result) {
    // Handle success
  }
};
```

#### **Specific Error Types:**
```typescript
const { 
  handleNetworkError, 
  handleValidationError, 
  handleAuthError, 
  handleApiError 
} = useError();

// Network error
handleNetworkError(new NetworkError('Connection failed'));

// Validation error
handleValidationError(new ValidationError('Invalid input'));

// Auth error
handleAuthError(new AuthError('Unauthorized'));

// API error
handleApiError(new ApiError('Server error', 500), '/api/users');
```

### 2. Error State Management

```typescript
const { lastError, errorCount, clearError } = useError();

// Show error status
if (lastError) {
  return (
    <div className="error-status">
      <p>Son hata: {lastError.message}</p>
      <p>Toplam hata sayısı: {errorCount}</p>
      <button onClick={clearError}>Temizle</button>
    </div>
  );
}
```

### 3. Custom Error Types

```typescript
import { NetworkError, ValidationError, AuthError, ApiError } from '@/lib/utils/error';

// Create custom errors
const networkError = new NetworkError('Bağlantı hatası');
const validationError = new ValidationError('Form hatası');
const authError = new AuthError('Yetkilendirme hatası');
const apiError = new ApiError('Sunucu hatası', 500);
```

### 4. Error Logging

```typescript
import { ErrorHandler } from '@/lib/utils/error';

// Log error with context
ErrorHandler.logError(error, {
  userId: session?.user?.id,
  componentName: 'MyComponent',
  action: 'fetchData',
  timestamp: new Date().toISOString(),
});

// Get error log
const errorLog = ErrorHandler.getErrorLog();

// Clear error log
ErrorHandler.clearErrorLog();
```

## Error Boundary Kullanımı

### **Global Error Boundary:**
Otomatik olarak tüm uygulamayı sarar.

### **Component-Level Error Boundary:**
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

function MyPage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to service
        console.error('Page error:', error, errorInfo);
      }}
      fallback={
        <div className="custom-error">
          <h2>Sayfa yüklenemedi</h2>
          <button onClick={() => window.location.reload()}>
            Sayfayı Yenile
          </button>
        </div>
      }
    >
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

## Error Types

### **NetworkError**
```typescript
new NetworkError('Bağlantı hatası oluştu');
```

### **ValidationError**
```typescript
new ValidationError('Form validasyon hatası');
```

### **AuthError**
```typescript
new AuthError('Yetkilendirme hatası');
```

### **ApiError**
```typescript
new ApiError('API hatası', 500);
```

## Error Messages

Önceden tanımlanmış error mesajları:

```typescript
import { ERROR_MESSAGES } from '@/lib/utils/error';

// Kullanım
handleError(error, undefined, ERROR_MESSAGES.networkError);
handleError(error, undefined, ERROR_MESSAGES.validationError);
handleError(error, undefined, ERROR_MESSAGES.authError);
handleError(error, undefined, ERROR_MESSAGES.apiError);
```

## Best Practices

### 1. **Error Boundary Placement**
- Global error boundary tüm uygulamayı sarar
- Component-level error boundary kritik component'ler için
- Route-level error boundary sayfa bazında

### 2. **Error Handling Strategy**
- Network errors için retry mekanizması
- Validation errors için kullanıcı dostu mesajlar
- Auth errors için login redirect
- API errors için fallback data

### 3. **Error Logging**
- Development'ta console.log
- Production'da error tracking service
- User context bilgileri ekle
- Stack trace korunmalı

### 4. **User Experience**
- Loading states göster
- Error mesajları kullanıcı dostu olsun
- Retry mekanizması sağla
- Fallback UI'lar hazırla

## Örnek Kullanım Senaryoları

### **Form Validation:**
```typescript
const { handleValidationError } = useError();

const handleSubmit = async (data: FormData) => {
  try {
    await validateForm(data);
    await submitForm(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error);
    } else {
      handleError(error);
    }
  }
};
```

### **API Call with Retry:**
```typescript
const { handleAsyncError, handleNetworkError } = useError();

const fetchDataWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await handleAsyncError(
        async () => {
          const response = await fetch('/api/data');
          if (!response.ok) {
            throw new ApiError('API error', response.status);
          }
          return response.json();
        }
      );
      
      if (result) return result;
    } catch (error) {
      if (i === retries - 1) {
        handleNetworkError(error as Error);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### **Component Error Recovery:**
```typescript
const { lastError, clearError } = useError();

useEffect(() => {
  if (lastError) {
    // Auto-recover after 5 seconds
    const timer = setTimeout(() => {
      clearError();
      // Retry operation
    }, 5000);
    
    return () => clearTimeout(timer);
  }
}, [lastError, clearError]);
```

## Error Tracking Integration

Error tracking servisleri için hazır yapı:

```typescript
// TODO: Implement in ErrorHandler
static sendToErrorService(error: Error, info: ErrorInfo) {
  // Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: info });
}
```

Bu sistem sayesinde tüm hatalar merkezi olarak yönetilir ve kullanıcı deneyimi korunur.
