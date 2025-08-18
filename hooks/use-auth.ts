'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { useError } from './use-error';
import { toastMessages } from '@/lib/utils/toast';
import { AuthError } from '@/lib/utils/error';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { success, error } = useToast();
  const { handleAuthError, handleAsyncError } = useError({
    showToast: false, // We'll handle toast manually
  });

  const isAuthenticated = !!session;
  const isLoading = status === 'loading';

  const login = async (email: string, password: string) => {
    return handleAsyncError(
      async () => {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new AuthError(result.error);
        }

        success(toastMessages.loginSuccess);
        return result;
      },
      undefined,
      toastMessages.loginError
    );
  };

  const logout = async () => {
    return handleAsyncError(
      async () => {
        await signOut({ redirect: false });
        success(toastMessages.logoutSuccess);
        router.push('/');
      },
      undefined,
      toastMessages.logoutError
    );
  };

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 