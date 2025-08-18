import { toast } from 'sonner';

// Direct toast functions for use outside of React components
export const showToast = {
  success: (message: string, options?: { duration?: number }) => {
    return toast.success(message, options);
  },
  
  error: (message: string, options?: { duration?: number }) => {
    return toast.error(message, options);
  },
  
  warning: (message: string, options?: { duration?: number }) => {
    return toast.warning(message, options);
  },
  
  info: (message: string, options?: { duration?: number }) => {
    return toast.info(message, options);
  },
  
  loading: (message: string, options?: { duration?: number }) => {
    return toast.loading(message, options);
  },
  
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
  
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
  
  dismissAll: () => {
    toast.dismiss();
  },
};

// Common toast messages
export const toastMessages = {
  // Success messages
  loginSuccess: 'Başarıyla giriş yapıldı',
  logoutSuccess: 'Başarıyla çıkış yapıldı',
  saveSuccess: 'Başarıyla kaydedildi',
  updateSuccess: 'Başarıyla güncellendi',
  deleteSuccess: 'Başarıyla silindi',
  createSuccess: 'Başarıyla oluşturuldu',
  
  // Error messages
  loginError: 'Giriş yapılırken bir hata oluştu',
  logoutError: 'Çıkış yapılırken bir hata oluştu',
  saveError: 'Kaydetme sırasında bir hata oluştu',
  updateError: 'Güncelleme sırasında bir hata oluştu',
  deleteError: 'Silme sırasında bir hata oluştu',
  createError: 'Oluşturma sırasında bir hata oluştu',
  networkError: 'Ağ bağlantısı hatası',
  serverError: 'Sunucu hatası',
  validationError: 'Lütfen tüm alanları doğru şekilde doldurun',
  
  // Warning messages
  unsavedChanges: 'Kaydedilmemiş değişiklikler var',
  sessionExpired: 'Oturum süreniz doldu',
  
  // Info messages
  loading: 'Yükleniyor...',
  processing: 'İşleniyor...',
  connecting: 'Bağlanıyor...',
};
