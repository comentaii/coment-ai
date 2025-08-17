'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingLayout } from '@/components/layout/landing-layout';

export default function HomePage() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/tr/dashboard');
    }
  }, [session, router]);

  return (
    <LandingLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-green dark:text-green-400 mb-4">
            Coment-AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Yapay Zeka Destekli Aday Değerlendirme ve Mülakat Platformu
          </p>
          <div className="space-y-4">
            <p className="text-base text-gray-600 dark:text-gray-400">
              Teknik işe alım süreçlerini dijitalleştirin ve hızlandırın
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/tr/auth/signin" 
                className="px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Giriş Yap
              </a>
              <a 
                href="/tr/auth/signup" 
                className="px-6 py-3 border border-brand-green text-brand-green rounded-lg hover:bg-green-50 transition-colors"
              >
                Kayıt Ol
              </a>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
} 