'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { User } from 'next-auth';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user = useMemo(() => session?.user, [session]);
  
  return {
    user: user as User | null,
    session,
    status, // 'loading', 'authenticated', 'unauthenticated'
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}; 