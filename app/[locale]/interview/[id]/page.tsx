'use client';

import { useParams } from 'next/navigation';
import { useGetInterviewDetailsQuery } from '@/services/api/interviewApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import InterviewLayout from '@/components/interview/interview-layout';

export default function InterviewPage() {
  const params = useParams();
  const interviewId = params.id as string;

  const { data: interviewDetails, isLoading, isError, error } = useGetInterviewDetailsQuery(interviewId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full p-4 gap-4">
        <Skeleton className="w-1/3 h-full" />
        <Skeleton className="w-2/3 h-full" />
      </div>
    );
  }

  if (isError || !interviewDetails) {
    const errorMessage = (error as any)?.data?.message || 'Mülakat yüklenirken bir hata oluştu.';
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="w-1/2">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
      <InterviewLayout interview={interviewDetails} />
  );
}
