# Error Sayfaları Kılavuzu

Bu dokümantasyon, CodileAI projesinde kullanılan error sayfalarının nasıl çalıştığını ve nasıl kullanılacağını açıklar.

## Error Sayfaları

### 1. **404 - Not Found (`app/[locale]/not-found.tsx`)**

**Kullanım Alanları:**
- Mevcut olmayan sayfalar
- Yanlış URL'ler
- Silinmiş içerikler

**Özellikler:**
- Arama ikonu ile görsel feedback
- Geri dönüş ve ana sayfa butonları
- Destek ekibi ile iletişim linki

**Otomatik Tetikleme:**
```typescript
import { notFound } from 'next/navigation';

// Component içinde
if (!data) {
  notFound();
}
```

**Programatik Yönlendirme:**
```typescript
import { redirectToNotFound } from '@/lib/utils/navigation-errors';

redirectToNotFound();
```

### 2. **401 - Unauthorized (`app/[locale]/unauthorized/page.tsx`)**

**Kullanım Alanları:**
- Giriş yapmamış kullanıcılar
- Oturum süresi dolmuş kullanıcılar
- Yetkilendirme gerektiren sayfalar

**Özellikler:**
- Shield ikonu ile güvenlik vurgusu
- Giriş yapma ve kayıt olma butonları
- Ana sayfa ve geri dönüş seçenekleri

**Otomatik Tetikleme:**
- Middleware tarafından otomatik yönlendirme
- Protected route'lara erişim denemesi

**Programatik Yönlendirme:**
```typescript
import { redirectToUnauthorized } from '@/lib/utils/navigation-errors';

redirectToUnauthorized();
```

### 3. **403 - Forbidden (`app/[locale]/forbidden/page.tsx`)**

**Kullanım Alanları:**
- Yetersiz yetkiye sahip kullanıcılar
- Role-based access control ihlalleri
- Admin paneline erişim denemeleri

**Özellikler:**
- Lock ikonu ile erişim kısıtlaması vurgusu
- Bilgilendirici açıklama kutusu
- Destek ekibi ile iletişim butonu

**Otomatik Tetikleme:**
- Middleware tarafından role kontrolü
- Admin route'larına erişim denemesi

**Programatik Yönlendirme:**
```typescript
import { redirectToForbidden } from '@/lib/utils/navigation-errors';

redirectToForbidden();
```

### 4. **500+ Server Errors (`app/[locale]/error.tsx`)**

**Kullanım Alanları:**
- Server-side hatalar
- API hataları
- Runtime hatalar

**Özellikler:**
- Error boundary ile otomatik yakalama
- Development modunda detaylı hata bilgileri
- Yenileme ve geri dönüş butonları

**Otomatik Tetikleme:**
- Next.js error boundary sistemi
- Server-side hatalar

## Middleware Entegrasyonu

### **Role-Based Access Control:**

```typescript
// Super Admin Routes
if (pathWithoutLocale.startsWith('/admin/')) {
  if (userRole !== 'super_admin') {
    return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
  }
}

// HR Manager Routes
if (pathWithoutLocale.startsWith('/candidates/') || 
    pathWithoutLocale.startsWith('/interviews/')) {
  if (!['hr_manager', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
  }
}

// Technical Interviewer Routes
if (pathWithoutLocale.startsWith('/proctoring/')) {
  if (!['technical_interviewer', 'hr_manager', 'super_admin'].includes(userRole)) {
    return NextResponse.redirect(new URL(`/${locale}/forbidden`, req.url));
  }
}
```

### **Authentication Check:**

```typescript
if (!token) {
  // User not authenticated, redirect to unauthorized page
  return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
}
```

## Utility Fonksiyonları

### **Navigation Errors (`lib/utils/navigation-errors.ts`)**

```typescript
import { 
  redirectToNotFound, 
  redirectToUnauthorized, 
  redirectToForbidden,
  redirectByStatusCode,
  redirectToLocalizedError,
  redirectByStatusCodeWithLocale 
} from '@/lib/utils/navigation-errors';

// Basit yönlendirmeler
redirectToNotFound();
redirectToUnauthorized();
redirectToForbidden();

// Status code ile yönlendirme
redirectByStatusCode(404);
redirectByStatusCode(401);
redirectByStatusCode(403);

// Locale-aware yönlendirmeler
redirectToLocalizedError('tr', 'not-found');
redirectToLocalizedError('en', 'unauthorized');
redirectToLocalizedError('tr', 'forbidden');

// Locale-aware status code yönlendirmesi
redirectByStatusCodeWithLocale('tr', 404);
redirectByStatusCodeWithLocale('en', 401);
redirectByStatusCodeWithLocale('tr', 403);
```

## API Route'larda Kullanım

### **Error Handling Örneği:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { redirectToNotFound, redirectToUnauthorized } from '@/lib/utils/navigation-errors';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const token = await getToken({ req: request });
    if (!token) {
      redirectToUnauthorized();
    }

    // Data fetch
    const data = await fetchData();
    if (!data) {
      redirectToNotFound();
    }

    return NextResponse.json(data);
  } catch (error) {
    // Server error - will trigger error.tsx
    throw new Error('Internal Server Error');
  }
}
```

## Test Endpoint

### **Error Test API (`/api/test-error`)**

Farklı error sayfalarını test etmek için kullanılır:

```typescript
// 404 test
GET /api/test-error?type=404

// 401 test
GET /api/test-error?type=401

// 403 test
GET /api/test-error?type=403

// 500 test
GET /api/test-error?type=500
```

## Özelleştirme

### **Custom Error Sayfası:**

```typescript
// app/[locale]/custom-error/page.tsx
export default function CustomErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Özel Hata Sayfası</h1>
        <p>Bu özel bir hata sayfasıdır.</p>
      </div>
    </div>
  );
}
```

### **Error Boundary ile Custom Fallback:**

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary
  fallback={<CustomErrorPage />}
  onError={(error, errorInfo) => {
    console.error('Custom error handler:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Best Practices

### 1. **Error Sayfası Tasarımı**
- Tutarlı görsel tasarım
- Kullanıcı dostu mesajlar
- Açık yönlendirme seçenekleri
- Destek iletişim bilgileri

### 2. **Middleware Kullanımı**
- Role-based access control
- Authentication checks
- Locale-aware redirects
- Error logging

### 3. **API Route'larda**
- Proper error handling
- Status code kullanımı
- User-friendly messages
- Logging ve monitoring

### 4. **Development vs Production**
- Development'ta detaylı hata bilgileri
- Production'da güvenli hata mesajları
- Error tracking integration
- Performance optimization

## Error Tracking Integration

### **Sentry Integration (Örnek):**

```typescript
// lib/utils/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function trackError(error: Error, context?: any) {
  Sentry.captureException(error, {
    extra: context,
    tags: {
      page: 'error-page',
      type: 'navigation-error'
    }
  });
}
```

Bu sistem sayesinde tüm error sayfaları merkezi olarak yönetilir ve kullanıcı deneyimi korunur.
