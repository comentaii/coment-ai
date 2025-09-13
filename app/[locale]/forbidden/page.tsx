'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Home, ArrowLeft, Mail } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            403 - Erişim Yasak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Bu sayfaya erişim yetkiniz bulunmuyor.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Gerekli izinlere sahip değilsiniz veya hesabınız bu işlem için yetkilendirilmemiş.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Erişim İzni Gerekli
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Bu sayfaya erişmek için farklı bir hesap türü veya ek izinler gerekebilir.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Erişim izni almak için{' '}
              <Link 
                href="mailto:support@codileai.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                destek ekibimizle
              </Link>
              {' '}iletişime geçin.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="mailto:support@codileai.com?subject=Erişim İzni Talebi">
                <Mail className="w-4 h-4 mr-2" />
                Destek Ekibi ile İletişim
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
