'use client';

import { Navbar } from './navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
} 