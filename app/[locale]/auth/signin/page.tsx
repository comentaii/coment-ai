'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/forms/login-form';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function SignInPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hoş Geldiniz
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Hesabınıza giriş yapın
          </p>
        </div>

        <Card className="shadow-2xl bg-white dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center dark:text-white">Giriş Yap</CardTitle>
            <CardDescription className="text-center text-base dark:text-gray-400">
              Bilgilerinizi girerek hesabınıza erişin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-600 dark:text-gray-400">
                Hesabınız yok mu?{' '}
                <Link href="/tr/auth/signup" className="text-brand-green hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium">
                  Kayıt olun
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 