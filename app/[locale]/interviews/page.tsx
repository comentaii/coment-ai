'use client';

import React, { useState } from 'react'; // Import useState
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { Calendar, Clock, Users, User, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetInterviewSessionsQuery, useCancelInterviewSessionMutation } from '@/services/api/interviewApi';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useToast } from '@/hooks/use-toast';
import { EditInterviewModal } from '@/components/modals/edit-interview-modal'; 

export default function InterviewsPage() {
  const t = useTranslations('InterviewsPage');
  const { data: sessionsData, isLoading, error } = useGetInterviewSessionsQuery();
  const [editingSession, setEditingSession] = useState<any | null>(null);

  if (isLoading) {
    return <InterviewsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/10 p-8 rounded-lg">
          <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-300">
            {t('errorTitle')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('errorMessage')}
          </p>
        </div>
      </div>
    );
  }

  const sessions = sessionsData?.data?.sessions || [];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-brand-green"/>
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 ? (
          <div className="space-y-6">
            {sessions.map((session: any) => (
              <InterviewSessionCard 
                key={session._id} 
                session={session} 
                onEdit={() => setEditingSession(session)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t('noSessionsTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('noSessionsDescription')}
            </p>
          </div>
        )}
      </div>
      {editingSession && (
        <EditInterviewModal 
          session={editingSession}
          isOpen={!!editingSession} 
          onClose={() => setEditingSession(null)} 
        />
      )}
    </DashboardLayout>
  );
}

function InterviewSessionCard({ session, onEdit }: { session: any, onEdit: () => void }) {
  const t = useTranslations('InterviewsPage');
  const router = useRouter(); // Initialize router
  const params = useParams(); // Get URL params
  const [cancelInterviewSession, { isLoading: isCancelling }] = useCancelInterviewSessionMutation();
  const { confirm } = useConfirmation();
  const { toast } = useToast();

  const handleCancel = async () => {
    const isConfirmed = await confirm({
      title: t('card.cancelConfirm.title'),
      description: t('card.cancelConfirm.description', { title: session.jobPosting?.title || t('card.jobTitlePlaceholder') }),
      confirmText: t('card.cancelConfirm.confirmText'),
      cancelText: t('card.cancelConfirm.cancelText'),
    });

    if (isConfirmed) {
      try {
        await cancelInterviewSession(session._id).unwrap();
        toast.success(t('card.toast.cancelSuccessTitle'), {
          description: t('card.toast.cancelSuccessDescription'),
        });
      } catch (error) {
        toast.error(t('card.toast.cancelErrorTitle'), {
          description: t('card.toast.cancelErrorDescription'),
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">{t('status.scheduled')}</Badge>;
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-600">{t('status.active')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">{t('status.completed')}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600">{t('status.cancelled')}</Badge>;
      default:
        return <Badge variant="outline">{t('status.unknown')}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: tr });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {session.jobPosting?.title || t('card.jobTitlePlaceholder')}
          </CardTitle>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {formatDate(session.scheduledDate)}
        </div>

        {/* Interviewer */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4 mr-2" />
          {session.interviewer?.name ? t('card.interviewer', { name: session.interviewer.name }) : t('card.interviewer_unassigned')}
        </div>

        {/* Candidates Count */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4 mr-2" />
          {t('card.candidates', { count: session.slots?.length || 0 })}
        </div>

        {/* Notes */}
        {session.notes && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{t('card.notes')}</strong> {session.notes}
          </div>
        )}

        {/* Master Link */}
        {session.masterLink && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {t('card.interviewerLinkTitle')}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {t('card.interviewerLinkDescription')}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}${session.masterLink}`);
                  toast.success(t('card.toast.copySuccess'));
                }}
              >
                {t('card.copyButton')}
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button size="sm" variant="outline" onClick={() => router.push(`/${params.locale}/interviews/${session._id}`)}>
            <Eye className="w-4 h-4 mr-2" />
            {t('card.viewButton')}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            {t('card.editButton')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isCancelling ? 'İptal Ediliyor...' : t('card.cancelButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InterviewsSkeleton() {
  return (
    <div className="container mx-auto p-8">
      <Skeleton className="h-10 w-1/3 mb-4" />
      <Skeleton className="h-5 w-2/3 mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/5" />
              <div className="flex justify-end space-x-2 pt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
