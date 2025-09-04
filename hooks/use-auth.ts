'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { useError } from './use-error';
import { toastMessages } from '@/lib/utils/toast';
import { AuthError } from '@/lib/utils/error';
import { UserRole } from '@/types/rbac';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { success, error } = useToast();
  const { handleAuthError, handleAsyncError } = useError({
    showToast: false, // We'll handle toast manually
  });

  const user = session?.user;
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  // Directly access companyId from the session user object
  const companyId = user?.companyId;

  // Check if the user has a specific role
  const hasRole = (role: UserRole) => {
    return user?.roles?.includes(role) ?? false;
  };

  // Check if the user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]) => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  };

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
    user,
    session,
    isLoading,
    isAuthenticated,
    companyId, // Return companyId directly
    hasRole,
    hasAnyRole,
    updateSession: update,
    login,
    logout,
  };
} 