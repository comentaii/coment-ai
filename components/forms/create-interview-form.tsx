'use client';

import React, { useState } from 'react';
import { FormikHelpers } from 'formik';
import { FormikForm, FormikSelect, FormSubmitButton } from '@/components/ui/formik-form';
// import { createInterviewSchema, CreateInterviewDto } from '@/lib/validation-schemas';
import { useCreateInterviewSessionMutation, CreateInterviewSessionRequest } from '@/services/api/interviewApi';
import { useGetCandidatesByCompanyQuery, useGetInterviewersByCompanyQuery } from '@/services/api/userApi';
import { useGetChallengesByCompanyQuery } from '@/services/api/challengeApi';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export function CreateInterviewForm() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { promise } = useToast();
  const [createInterview, { isLoading }] = useCreateInterviewSessionMutation();
  const [createdInterviewLink, setCreatedInterviewLink] = useState<string | null>(null);

  const { companyId } = useAuth(); // Destructure companyId directly from useAuth

  const { data: candidates, isLoading: isLoadingCandidates } = useGetCandidatesByCompanyQuery(companyId!, { skip: !companyId });
  const { data: interviewers, isLoading: isLoadingInterviewers } = useGetInterviewersByCompanyQuery(companyId!, { skip: !companyId });
  const { data: challenges, isLoading: isLoadingChallenges } = useGetChallengesByCompanyQuery(companyId!, { skip: !companyId });

  const candidateOptions = candidates?.map(c => ({ value: String(c._id), label: `${c.name} (${c.email})` })) || [];
  const interviewerOptions = interviewers?.map(i => ({ value: String(i._id), label: `${i.name} (${i.email})` })) || [];
  const challengeOptions = challenges?.map(ch => ({ value: String(ch._id), label: ch.title })) || [];

  const initialValues: CreateInterviewSessionRequest = {
    jobPostingId: '', 
    interviewerId: '', 
    scheduledDate: new Date().toISOString(),
    candidateIds: [],
    notes: '',
  };

  const handleSubmit = async (values: CreateInterviewSessionRequest, { resetForm }: FormikHelpers<CreateInterviewSessionRequest>) => {
    setCreatedInterviewLink(null);
    await promise(createInterview(values).unwrap(), {
      loading: 'Mülakat oluşturuluyor...',
      success: (newInterview) => {
        setCreatedInterviewLink(`/interview/${newInterview.session._id}`);
        resetForm();
        return 'Mülakat başarıyla oluşturuldu!';
      },
      error: 'Mülakat oluşturulurken bir hata oluştu.',
    });
  };

  if (isAuthLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    );
  }

  if (!companyId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Şirket Bilgisi Eksik</AlertTitle>
        <AlertDescription>
          Mülakat oluşturabilmek için kullanıcınızın bir şirkete atanmış olması gerekmektedir.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <FormikForm 
        initialValues={initialValues} 
        // validationSchema={createInterviewSchema} 
        onSubmit={handleSubmit} 
        enableReinitialize
      >
        {(formikProps) => (
          <>
            <FormikSelect 
              name="jobPostingId" 
              label="İş İlanı Seçin" 
              options={challengeOptions} 
              disabled={isLoadingChallenges}
              touched={formikProps.touched.jobPostingId}
              error={formikProps.errors.jobPostingId}
            />
            <FormikSelect 
              name="interviewerId" 
              label="Mülakatçı Seçin" 
              options={interviewerOptions}
              disabled={isLoadingInterviewers}
              touched={formikProps.touched.interviewerId}
              error={formikProps.errors.interviewerId}
            />
            <FormikSelect 
              name="candidateIds" 
              label="Adaylar Seçin" 
              options={candidateOptions}
              disabled={isLoadingCandidates}
              touched={formikProps.touched.candidateIds}
              error={formikProps.errors.candidateIds}
              multiple
            />
            <FormSubmitButton loading={isLoading}>Mülakat Oluştur ve Link Al</FormSubmitButton>
          </>
        )}
      </FormikForm>
      
      {createdInterviewLink && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Mülakat Linki Başarıyla Oluşturuldu!</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <p className="text-sm">Paylaşılabilir mülakat linkiniz:</p>
            <Link href={createdInterviewLink as any} target="_blank" className="font-mono text-blue-500 hover:underline">{createdInterviewLink}</Link>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
