'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Copy } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// A wrapper component to use the hook inside the class component
function CopyButton({ textToCopy }: { textToCopy: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Kopyalandı!', {
        description: 'Hata detayları panoya kopyalandı.',
      });
    });
  };

  return (
    <Button onClick={handleCopy} size="sm" variant="ghost" className="gap-2">
      <Copy className="w-4 h-4" />
      Kopyala
    </Button>
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Update state with error info
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const componentStack = this.state.errorInfo?.componentStack?.trim();
      const stackLines = this.state.error?.stack?.split('\n').slice(0, 5).join('\n');
      const errorDetailsToCopy = `Hata: ${this.state.error?.message}\n\n${componentStack ? `Component Stack:\n${componentStack}\n\n` : ''}Stack Trace (ilk 10 satır):\n${stackLines}`;

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Bir Hata Oluştu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
                    Hata Detayları (Geliştirici Modu)
                    <CopyButton textToCopy={errorDetailsToCopy} />
                  </summary>
                  <div className="space-y-2 mt-2">
                    <div>
                      <strong>Hata:</strong>
                      <pre className="mt-1 text-red-600 dark:text-red-400 break-words whitespace-pre-wrap">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-gray-600 dark:text-gray-400 text-xs overflow-auto max-h-48">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yenile
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Ana Sayfa
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
