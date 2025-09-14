'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AnimationProvider } from '@/components/providers/animation-provider';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <AnimationProvider>
      <div className='page-wrapper relative z-[1] bg-white dark:bg-gray-900'>
        {/*...::: Header Start :::... */}
        <Navbar />
        {/*...::: Header End :::... */}
        <main className='main-wrapper relative overflow-hidden'>
          {children}
        </main>
        {/*...::: Footer Start :::... */}
        <Footer />
        {/*...::: Footer End :::... */}
      </div>
    </AnimationProvider>
  );
}