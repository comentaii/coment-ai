'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, BarChart, Loader2, AlertTriangle } from 'lucide-react';
import { useGetAllCompaniesQuery } from '@/services/api/companyApi';
import { useGetAllUsersQuery } from '@/services/api/userApi';
import { useTranslations } from 'next-intl';

function StatCard({ title, value, icon: Icon, isLoading }: { title: string, value: number, icon: React.ElementType, isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 flex items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminDashboard() {
  const t = useTranslations('super-admin.dashboard');
  const { data: companies, isLoading: isLoadingCompanies } = useGetAllCompaniesQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  
  // Placeholder for active interviews
  const activeInterviews = 8;
  const isLoadingInterviews = false;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title={t('totalCompanies')}
          value={companies?.length || 0}
          icon={Building}
          isLoading={isLoadingCompanies}
        />
        <StatCard 
          title={t('totalUsers')}
          value={users?.length || 0}
          icon={Users}
          isLoading={isLoadingUsers}
        />
        <StatCard 
          title={t('activeInterviews')}
          value={activeInterviews}
          icon={BarChart}
          isLoading={isLoadingInterviews}
        />
      </div>
    </div>
  );
}
