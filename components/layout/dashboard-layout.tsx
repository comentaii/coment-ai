'use client';

import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from './sidebar';
import { DashboardNavbar } from './dashboard-navbar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/tr/auth/signin');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark dark:text-gray-100 mb-4">
            Giriş yapmanız gerekiyor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yönlendiriliyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark">
      <div className="flex h-screen">
        {/* Sidebar - Logo Area */}
        <Sidebar />
        
        {/* Right Side - Navbar + Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Top Navbar - Full Width */}
          <div className="w-full border-b border-gray-200 dark:border-gray-700">
            <DashboardNavbar />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 