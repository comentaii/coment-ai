'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useToast } from './use-toast';
import { useError } from './use-error';
import { toastMessages } from '@/lib/utils/toast';
import { AuthError } from '@/lib/utils/error';

export function useAuth() {
  const { data: session, status } = useSession();
  const { success } = useToast();
  const { handleAsyncError } = useError({
    showToast: false,
  });
  
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  const user = session?.user || null;

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

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}