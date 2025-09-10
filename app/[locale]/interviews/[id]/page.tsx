'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useGetInterviewDetailsQuery } from '@/services/api/interviewApi';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, Clock, User, FileText, Users, Link as LinkIcon, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function InterviewDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function InterviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('InterviewDetailPage');

  const { data: interviewData, error, isLoading } = useGetInterviewDetailsQuery(id, {
    skip: !id,
  });
  
  const interview = interviewData?.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge variant="outline" className="text-blue-600 border-blue-600">{t('status.scheduled')}</Badge>;
      case 'active': return <Badge variant="outline" className="text-green-600 border-green-600">{t('status.active')}</Badge>;
      case 'completed': return <Badge variant="outline" className="text-gray-600 border-gray-600">{t('status.completed')}</Badge>;
      case 'cancelled': return <Badge variant="outline" className="text-red-600 border-red-600">{t('status.cancelled')}</Badge>;
      default: return <Badge variant="outline">{t('status.unknown')}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: tr });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return <InterviewDetailsSkeleton />;
  }

  if (error || !interview) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-700">{t('errorTitle')}</h2>
        <p className="mt-2 text-gray-600">{t('errorMessage')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-brand-green"/>
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {interview.jobPosting?.title || t('jobTitlePlaceholder')}
          </p>
        </div>
        {getStatusBadge(interview.status)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2" />{t('scheduleTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-3" />
            <span>{formatDate(interview.scheduledDate)}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-3" />
            <span>{t('interviewer')}: <strong>{interview.interviewer?.name || t('unassigned')}</strong></span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2" />{t('candidatesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {interview.slots?.length > 0 ? (
            <ul className="space-y-3">
              {interview.slots.map((slot: any) => (
                <li key={slot._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="font-medium">{slot.candidate?.name || t('unknownCandidate')}</span>
                  <Badge variant={slot.status === 'pending' ? 'default' : 'secondary'}>{slot.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t('noCandidates')}</p>
          )}
        </CardContent>
      </Card>

      {interview.masterLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LinkIcon className="w-5 h-5 mr-2" />{t('masterLinkTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <p className="text-sm font-mono text-blue-800 dark:text-blue-200">{interview.masterLink}</p>
              <Button size="sm" variant="ghost">Copy</Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
