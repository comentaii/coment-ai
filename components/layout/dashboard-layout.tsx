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
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the session is not loading and there's no session
    if (!isLoading && !session) {
      router.push('/tr/auth/signin');
    }
  }, [session, isLoading, router]);

  // Show loading while session is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Yükleniyor...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lütfen bekleyin
          </p>
        </div>
      </div>
    );
  }

  // Show login prompt only if session is definitely not available
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-20 xl:ml-72 transition-all duration-300 ease-in-out min-h-screen">
        {/* Top Navbar */}
          <DashboardNavbar />
        
        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout; 