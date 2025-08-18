'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bir Hata Oluştu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Sorun devam ederse, lütfen daha sonra tekrar deneyin.
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-left">
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hata Detayları (Geliştirici Modu)
              </summary>
              <div className="space-y-2">
                <div>
                  <strong>Hata:</strong>
                  <pre className="mt-1 text-red-600 dark:text-red-400 break-words">
                    {error.message}
                  </pre>
                </div>
                {error.digest && (
                  <div>
                    <strong>Error ID:</strong>
                    <pre className="mt-1 text-gray-600 dark:text-gray-400">
                      {error.digest}
                    </pre>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="mt-1 text-gray-600 dark:text-gray-400 text-xs overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
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

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Eğer bu hata devam ederse, lütfen{' '}
              <Link 
                href="mailto:support@coment-ai.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                destek ekibimizle
              </Link>
              {' '}iletişime geçin.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
