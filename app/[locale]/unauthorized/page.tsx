'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            401 - Yetkilendirme Gerekli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Bu sayfaya erişmek için giriş yapmanız gerekiyor.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Lütfen hesabınıza giriş yapın veya yeni bir hesap oluşturun.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/auth/signin">
                <LogIn className="w-4 h-4 mr-2" />
                Giriş Yap
              </Link>
            </Button>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Hesabınız yok mu?{' '}
              <Link 
                href="/auth/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Yeni hesap oluşturun
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
