# Toast Kullanım Kılavuzu

Bu dokümantasyon, Coment-AI projesinde global toast sisteminin nasıl kullanılacağını açıklar.

## Kurulum

Toast sistemi otomatik olarak `RootProviders` içinde kurulmuştur. Herhangi bir ek kurulum gerektirmez.

## Kullanım Yöntemleri

### 1. React Hook Kullanımı (Component'lerde)

```typescript
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { success, error, warning, info, loading, promise } = useToast();

  const handleSuccess = () => {
    success('İşlem başarılı!');
  };

  const handleError = () => {
    error('Bir hata oluştu!');
  };

  const handleWarning = () => {
    warning('Dikkat!');
  };

  const handleInfo = () => {
    info('Bilgi mesajı');
  };

  const handleLoading = () => {
    const loadingToast = loading('Yükleniyor...');
    // İşlem tamamlandığında
    setTimeout(() => {
      loadingToast.dismiss();
      success('Tamamlandı!');
    }, 3000);
  };

  const handlePromise = () => {
    const myPromise = fetch('/api/data');
    promise(myPromise, {
      loading: 'Veri yükleniyor...',
      success: (data) => `Başarılı: ${data.length} kayıt`,
      error: (err) => `Hata: ${err.message}`,
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Başarı</button>
      <button onClick={handleError}>Hata</button>
      <button onClick={handleWarning}>Uyarı</button>
      <button onClick={handleInfo}>Bilgi</button>
      <button onClick={handleLoading}>Yükleme</button>
      <button onClick={handlePromise}>Promise</button>
    </div>
  );
}
```

### 2. Direct Fonksiyon Kullanımı (Component Dışında)

```typescript
import { showToast } from '@/lib/utils/toast';

// Utility fonksiyonlarda
export const handleApiCall = async () => {
  try {
    const result = await fetch('/api/data');
    showToast.success('Veri başarıyla yüklendi');
    return result;
  } catch (error) {
    showToast.error('Veri yüklenirken hata oluştu');
    throw error;
  }
};

// API route'larda
export async function POST(request: NextRequest) {
  try {
    // ... işlem
    return ResponseHandler.success({ message: 'Başarılı' });
  } catch (error) {
    return ResponseHandler.error('Hata oluştu', 500);
  }
}
```

### 3. Önceden Tanımlanmış Mesajlar

```typescript
import { toastMessages } from '@/lib/utils/toast';

// Önceden tanımlanmış mesajları kullanın
success(toastMessages.loginSuccess);
error(toastMessages.networkError);
warning(toastMessages.unsavedChanges);
info(toastMessages.loading);
```

## Toast Tipleri

### Success Toast
```typescript
success('İşlem başarılı!');
```

### Error Toast
```typescript
error('Bir hata oluştu!');
```

### Warning Toast
```typescript
warning('Dikkat!');
```

### Info Toast
```typescript
info('Bilgi mesajı');
```

### Loading Toast
```typescript
const loadingToast = loading('Yükleniyor...');
// İşlem tamamlandığında
loadingToast.dismiss();
```

### Promise Toast
```typescript
promise(myPromise, {
  loading: 'Yükleniyor...',
  success: (data) => `Başarılı: ${data}`,
  error: (err) => `Hata: ${err.message}`,
});
```

## Toast Seçenekleri

```typescript
interface ToastOptions {
  duration?: number; // Milisaniye cinsinden
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
}

// Örnek kullanım
success('Mesaj', {
  duration: 5000,
  action: {
    label: 'Geri Al',
    onClick: () => console.log('Geri alındı'),
  },
});
```

## Toast Kontrolü

```typescript
const { dismiss, dismissAll } = useToast();

// Belirli bir toast'u kapat
dismiss(toastId);

// Tüm toast'ları kapat
dismissAll();
```

## Özelleştirme

Toast'ların görünümü `components/ui/sonner.tsx` dosyasında özelleştirilebilir:

```typescript
<Sonner
  theme={theme}
  position="top-right"
  richColors
  closeButton
  duration={4000}
  toastOptions={{
    classNames: {
      toast: "custom-toast-class",
      description: "custom-description-class",
    },
  }}
/>
```

## Best Practices

1. **Kısa ve Öz Mesajlar**: Toast mesajları kısa ve anlaşılır olmalı
2. **Uygun Tip Kullanımı**: Mesaj tipine uygun toast tipi seçin
3. **Promise Kullanımı**: Async işlemler için promise toast kullanın
4. **Loading State**: Uzun süren işlemler için loading toast kullanın
5. **Hata Yönetimi**: Hataları kullanıcı dostu mesajlarla gösterin

## Örnek Kullanım Senaryoları

### Form Submit
```typescript
const handleSubmit = async (data: FormData) => {
  const loadingToast = loading('Kaydediliyor...');
  
  try {
    await submitForm(data);
    loadingToast.dismiss();
    success('Form başarıyla kaydedildi');
  } catch (error) {
    loadingToast.dismiss();
    error('Form kaydedilirken hata oluştu');
  }
};
```

### API Call
```typescript
const fetchData = async () => {
  const promise = fetch('/api/data').then(res => res.json());
  
  promise(promise, {
    loading: 'Veriler yükleniyor...',
    success: (data) => `${data.length} kayıt yüklendi`,
    error: (err) => 'Veriler yüklenirken hata oluştu',
  });
};
```

### File Upload
```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const promise = fetch('/api/upload', {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
  
  promise(promise, {
    loading: 'Dosya yükleniyor...',
    success: (data) => `Dosya başarıyla yüklendi: ${data.filename}`,
    error: (err) => 'Dosya yüklenirken hata oluştu',
  });
};
```
