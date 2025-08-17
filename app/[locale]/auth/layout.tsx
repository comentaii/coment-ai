'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/tr/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark">
      {children}
    </div>
  );
} 