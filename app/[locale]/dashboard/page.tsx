'use client';

import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRoleBadge } from '@/components/user-role-badge';
import { StateDebugger } from '@/components/debug/state-debugger';

export default function DashboardPage() {
  const { session } = useAuth();
  const t = useTranslations('Common');

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-green dark:text-green-400 mb-2">
            Aday Paneli
          </h1>
          <p className="text-lg text-brand-dark dark:text-gray-300">
            Mülakat ve değerlendirme süreçleri
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-green dark:text-green-400 mb-4">
            Hoş geldiniz, <span className="text-brand-green dark:text-green-400">{session.user?.name}</span>
          </h2>
          <UserRoleBadge role={session.user?.role || 'candidate'} />
        </div>

        {/* User Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Kullanıcı Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-brand-dark dark:text-gray-300">Ad Soyad</label>
                <p className="text-base text-brand-dark dark:text-gray-200">{session.user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark dark:text-gray-300">Rol</label>
                <div className="mt-1">
                  <UserRoleBadge role={session.user?.role || 'candidate'} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark dark:text-gray-300">Email</label>
                <p className="text-base text-brand-dark dark:text-gray-200">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark dark:text-gray-300">Şirket ID</label>
                <p className="text-base text-brand-dark dark:text-gray-200">
                  {session.user?.companyId || 'Şirket ilişkisi yok'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Mülakatlarım</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-primary">
                Mülakatlarım
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Profilim</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-primary">
                Profilim
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Ayarlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-primary">
                Ayarlar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Debug Component - Remove this in production */}
      <StateDebugger />
    </DashboardLayout>
  );
} 