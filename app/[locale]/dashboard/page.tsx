'use client';

import { useAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRoleBadge } from '@/components/user-role-badge';
import { StateDebugger } from '@/components/debug/state-debugger';
import { getActionCardsByRole } from '@/lib/constants/action-cards';
import { useNavigation } from '@/lib/utils/navigation';
import { USER_ROLES, type UserRole } from '@/lib/constants/roles';
import { useToast } from '@/hooks/use-toast';
import { useError } from '@/hooks/use-error';
import { NetworkError, ValidationError, ApiError } from '@/lib/utils/error';
import { useTranslations } from 'next-intl';
import { RBACGuard } from '@/components/ui/rbac-guard';
import { CreateInterviewForm } from '@/components/forms/create-interview-form';

export default function DashboardPage() {
  const { session } = useAuth();
  const { getLocalizedPath } = useNavigation();
  const { success, error, warning, info, loading, promise } = useToast();
  const { 
    handleAsyncError, 
    handleNetworkError, 
    handleValidationError, 
    handleApiError,
    lastError,
    errorCount,
    clearError 
  } = useError();
  const t = useTranslations('dashboard');

  if (!session) {
    return null;
  }

  const userRole = (session.user?.role as UserRole) || USER_ROLES.CANDIDATE;
  const actionCards = getActionCardsByRole(userRole);

  // Toast test fonksiyonları
  const handleTestToasts = () => {
    success('Bu bir başarı mesajı!');
    setTimeout(() => error('Bu bir hata mesajı!'), 1000);
    setTimeout(() => warning('Bu bir uyarı mesajı!'), 2000);
    setTimeout(() => info('Bu bir bilgi mesajı!'), 3000);
  };

  const handleTestLoading = () => {
    const loadingToast = loading('Yükleniyor...');
    setTimeout(() => {
      loadingToast.dismiss();
      success('Yükleme tamamlandı!');
    }, 3000);
  };

  const handleTestPromise = () => {
    const testPromise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('İşlem başarılı!');
        } else {
          reject(new Error('İşlem başarısız!'));
        }
      }, 2000);
    });

    promise(testPromise, {
      loading: 'İşlem yapılıyor...',
      success: (data) => `Başarılı: ${data}`,
      error: (err) => `Hata: ${err.message}`,
    });
  };

  // Error handling test fonksiyonları
  const handleTestNetworkError = () => {
    handleNetworkError(new NetworkError('Bağlantı hatası oluştu'));
  };

  const handleTestValidationError = () => {
    handleValidationError(new ValidationError('Form validasyon hatası'));
  };

  const handleTestApiError = () => {
    handleApiError(new ApiError('API endpoint hatası', 500), '/api/test');
  };

  const handleTestAsyncError = async () => {
    const result = await handleAsyncError(
      async () => {
        // Simulate async error
        await new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Async işlem hatası')), 1000);
        });
        return 'success';
      },
      undefined,
      'Async işlem sırasında hata oluştu'
    );
    
    if (result) {
      success('Async işlem başarılı!');
    }
  };

  const handleTestComponentError = () => {
    // This will trigger the error boundary
    throw new Error('Component hatası test ediliyor!');
  };

  // Error page test fonksiyonları
  const handleTest404Page = () => {
    window.location.href = '/api/test-error?type=404';
  };

  const handleTest401Page = () => {
    window.location.href = '/api/test-error?type=401';
  };

  const handleTest403Page = () => {
    window.location.href = '/api/test-error?type=403';
  };

  const handleTest500Page = () => {
    window.location.href = '/api/test-error?type=500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Hoş geldiniz, {session.user?.name}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Coment-AI platformuna hoş geldiniz. Aşağıdaki seçeneklerden birini seçerek başlayın.
          </p>
        </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('create_interview_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateInterviewForm />
            </CardContent>
          </Card>

        {/* Error Status Card */}
        {lastError && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-100">
                Son Hata Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Hata:</strong> {lastError.message}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>Toplam Hata Sayısı:</strong> {errorCount}
                </p>
              </div>
              <Button onClick={clearError} variant="outline" size="sm">
                Hata Durumunu Temizle
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Toast Test Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Toast Test Butonları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTestToasts} variant="outline">
                Test Toasts
              </Button>
              <Button onClick={handleTestLoading} variant="outline">
                Test Loading
              </Button>
              <Button onClick={handleTestPromise} variant="outline">
                Test Promise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling Test Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Error Handling Test Butonları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTestNetworkError} variant="outline">
                Network Error
              </Button>
              <Button onClick={handleTestValidationError} variant="outline">
                Validation Error
              </Button>
              <Button onClick={handleTestApiError} variant="outline">
                API Error
              </Button>
              <Button onClick={handleTestAsyncError} variant="outline">
                Async Error
              </Button>
              <Button onClick={handleTestComponentError} variant="destructive">
                Component Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Pages Test Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Error Sayfaları Test Butonları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTest404Page} variant="outline">
                404 - Not Found
              </Button>
              <Button onClick={handleTest401Page} variant="outline">
                401 - Unauthorized
              </Button>
              <Button onClick={handleTest403Page} variant="outline">
                403 - Forbidden
              </Button>
              <Button onClick={handleTest500Page} variant="outline">
                500 - Server Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Hesap Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ad Soyad</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{session.user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base text-gray-900 dark:text-gray-100">{session.user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</p>
                <div className="flex items-center gap-2">
                  {session.user?.roles?.length > 0 ? (
                    session.user.roles.map((role) => <UserRoleBadge key={role} role={role} />)
                  ) : (
                    <UserRoleBadge role="candidate" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Şirket ID</p>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {session.user?.companyId || 'Şirket ilişkisi yok'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {actionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${card.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-green dark:group-hover:text-green-400 transition-colors duration-200">
                        {card.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                      {card.description}
                    </p>
                    <Button 
                      className="w-full bg-brand-green hover:bg-brand-green/90 text-white transition-colors duration-200"
                      asChild
                    >
                      <a href={getLocalizedPath(card.path)}>
                        {card.title}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Debug Component - Remove this in production */}
      <StateDebugger />
    </DashboardLayout>
  );
} 