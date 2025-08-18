import { toast } from 'sonner';
import { useCallback } from 'react';

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showToast = useCallback((message: string, options?: ToastOptions) => {
    return toast(message, options);
  }, []);

  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    return toast.warning(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    return toast.info(message, options);
  }, []);

  const showLoading = useCallback((message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  }, []);

  const showPromise = useCallback(<T>(
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
  }, []);

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    toast: showToast,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss,
    dismissAll,
  };
};
