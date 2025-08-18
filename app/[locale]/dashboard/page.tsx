'use client';

import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRoleBadge } from '@/components/user-role-badge';
import { StateDebugger } from '@/components/debug/state-debugger';
import { getActionCardsByRole } from '@/lib/constants/action-cards';
import { useNavigation } from '@/lib/utils/navigation';
import { USER_ROLES, type UserRole } from '@/lib/constants/roles';

export default function DashboardPage() {
  const { session } = useAuth();
  const t = useTranslations('Common');
  const { getLocalizedPath } = useNavigation();

  if (!session) {
    return null;
  }

  const userRole = (session.user?.role as UserRole) || USER_ROLES.CANDIDATE;
  const actionCards = getActionCardsByRole(userRole);

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
                  <UserRoleBadge role={userRole} />
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