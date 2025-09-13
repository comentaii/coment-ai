'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/forms/signup-form';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function SignUpPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Hesap Oluşturun
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Yeni hesap oluşturun
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Kayıt Ol</CardTitle>
            <CardDescription className="text-center text-base">
              Bilgilerinizi girerek hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-600 dark:text-gray-400">
                Zaten hesabınız var mı?{' '}
                <Link href="/tr/auth/signin" className="text-brand-green hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 