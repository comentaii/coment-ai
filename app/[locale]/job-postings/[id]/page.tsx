'use client';
import React from 'react';
import { useGetJobPostingByIdQuery, useLazyGetJobPostingByIdQuery, useGetCandidatesForJobQuery, useTriggerMatchingMutation, useMatchCandidateToJobMutation } from '@/services/api/job-posting-api';
import { useGetInterviewSessionsQuery } from '@/services/api/interviewApi';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { AlertTriangle, Briefcase, Tag, Users, Zap, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CandidateMatchCard } from '@/components/job-postings/candidate-match-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ScheduleInterviewModal } from '@/components/interviews/schedule-interview-modal';

interface MatchingStatus {
  status: 'idle' | 'start' | 'progress' | 'completed' | 'error';
  total?: number;
  processed?: number;
  message?: string;
}

export default function JobPostingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.['id']) ? params?.['id'][0] : (params?.['id'] as string);
  const t = useTranslations('JobPostingDetailPage');
  const { info, error: showError } = useToast();


  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>({ status: 'idle' });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [triggerRefresh, { data, isLoading, isError }] = useLazyGetJobPostingByIdQuery();
  const { data: candidatesData, refetch: refetchCandidates } = useGetCandidatesForJobQuery(id || '', {
    skip: !id,
  });
  const [triggerMatching, { isLoading: isMatching }] = useTriggerMatchingMutation();
  const [matchCandidate] = useMatchCandidateToJobMutation();
  const { data: interviewSessionsData } = useGetInterviewSessionsQuery();

  useEffect(() => {
    if (id) {
      triggerRefresh(id);
    }
  }, [id, triggerRefresh]);
  



  // Handle both data structures - the API might return just the job posting or the full structure
  const jobPosting = data?.jobPosting || data;
  
  // Ensure we have the job posting data and it has the required properties
  if (!jobPosting || !('title' in jobPosting) || !('description' in jobPosting) || !('skills' in jobPosting)) {
    return null;
  }

  // Check if there are any interview sessions for this job posting
  console.log('interviewSessionsData:', interviewSessionsData);
  console.log('interviewSessionsData.data:', interviewSessionsData?.data);
  console.log('interviewSessionsData.data.sessions:', interviewSessionsData?.data?.sessions);
  console.log('Array.isArray(interviewSessionsData?.data?.sessions):', Array.isArray(interviewSessionsData?.data?.sessions));
  
  const hasInterviewSessions = Array.isArray(interviewSessionsData?.data?.sessions) && 
    interviewSessionsData.data.sessions.some(
      (session: any) => session.jobPostingId === id
    ) || false;

  const handleStartMatching = async () => {
    if (!id) return;
    
    setMatchingStatus({ status: 'start', total: 0, processed: 0 });
    try {
      await triggerMatching(id).unwrap();
      info('Tarama Başlatıldı');
      // Refresh candidates data after matching
      setTimeout(() => {
        refetchCandidates();
      }, 2000);
    } catch (error) {
      console.error('Failed to start matching process:', error);
      showError('Eşleştirme işlemi başlatılamadı.');
      setMatchingStatus({ status: 'idle' });
    }
  };

  const handleMatchCandidate = async (candidateId: string) => {
    if (!id) return;
    
    try {
      await matchCandidate({ jobPostingId: id, candidateId }).unwrap();
      info('Aday başarıyla eşleştirildi');
      // Refresh candidates data
      refetchCandidates();
    } catch (error) {
      console.error('Failed to match candidate:', error);
      showError('Aday eşleştirilemedi');
    }
  };

  if (isLoading && !data) {
    return <PageSkeleton />;
  }

  if (isError || !data || !jobPosting) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="text-center bg-red-50 dark:bg-red-900/10 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
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

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
          <Briefcase className="w-8 h-8 mr-3 text-brand-green"/>
          {jobPosting.title}
        </h1>
        <div 
          className="mt-2 text-md text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: jobPosting.description }} 
        />
        <div className="mt-4 flex flex-wrap gap-2 items-center">
            <h3 className="text-lg font-semibold mr-2 flex items-center"><Tag className="w-5 h-5 mr-2"/>İstenen Yetenekler:</h3>
            {jobPosting.skills.map((skill: string) => (
                <span key={skill} className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full">{skill}</span>
            ))}
        </div>
        
        {/* Interview Status */}
        {hasInterviewSessions && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Mülakat Planlandı
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Bu iş ilanı için mülakat oturumu oluşturulmuş. Detayları görüntülemek için{' '}
                  <a href="/tr/interviews" className="underline hover:no-underline">
                    Mülakatlar sayfasını
                  </a>{' '}
                  ziyaret edin.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matched Candidates Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
                <Users className="w-7 h-7 mr-3 text-brand-green"/>
                {t('matchedCandidatesTitle')}
            </h2>
            <div className="flex space-x-3">
              <Button 
                onClick={() => {
                  console.log('Mülakat Planla butonuna tıklandı');
                  console.log('candidatesData:', candidatesData);
                  console.log('matched candidates:', candidatesData?.matched?.length || 0);
                  setIsScheduleModalOpen(true);
                }}
                disabled={!candidatesData?.matched || candidatesData.matched.length === 0 || hasInterviewSessions}
                variant="outline"
                title={hasInterviewSessions ? "Bu iş ilanı için mülakat zaten planlanmış" : "Seçili adaylar için mülakat planla"}
              >
                <Calendar className="w-4 h-4 mr-2"/>
                {hasInterviewSessions ? "Mülakat Planlandı" : "Mülakat Planla"}
              </Button>
              <Button 
                onClick={handleStartMatching} 
                disabled={isMatching || matchingStatus.status === 'progress' || matchingStatus.status === 'start'}
                title="Aday havuzunu tara ve eşleştir"
              >
                <Zap className="w-4 h-4 mr-2"/>
                {isMatching ? 'Taranıyor...' : matchingStatus.status === 'progress' ? 'Taranıyor...' : 'Eşleşmeleri Tara / Güncelle'}
              </Button>
            </div>
        </div>

        {/* Matching Progress Bar */}
        {(matchingStatus.status === 'start' || matchingStatus.status === 'progress') && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Adaylar taranıyor...</p>
                    <p className="text-sm font-semibold">{matchingStatus.processed || 0} / {matchingStatus.total || 0}</p>
                </div>
                <Progress value={((matchingStatus.processed || 0) / (matchingStatus.total || 1)) * 100} className="h-2"/>
            </div>
        )}

        {/* Manual Matching Status */}
        {isMatching && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Manuel eşleştirme işlemi başlatılıyor...
                    </p>
                </div>
            </div>
        )}

        {/* Eşleştirilmiş Adaylar */}
        {candidatesData?.matched && candidatesData.matched.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
              ✅ Eşleştirilmiş Adaylar ({candidatesData.matched.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {candidatesData.matched.map((candidate) => (
                <CandidateMatchCard key={candidate._id?.toString() || ''} candidate={candidate} />
              ))}
            </div>
          </div>
        )}

        {/* Eşleştirilmemiş Adaylar */}
        {candidatesData?.unmatched && candidatesData.unmatched.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-orange-600 dark:text-orange-400">
              ⏳ Eşleştirilmemiş Adaylar ({candidatesData.unmatched.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {candidatesData.unmatched.map((candidate) => (
                <div key={candidate._id?.toString() || ''} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {candidate.analysisResult?.fullName || 'İsim Belirtilmemiş'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {candidate.analysisResult?.summary || 'Özet bulunamadı'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Seviye: {candidate.analysisResult?.experienceLevel || 'Belirsiz'}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleMatchCandidate(candidate._id?.toString() || '')}
                      disabled={isMatching}
                    >
                      Eşleştir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiç Aday Yok */}
        {(!candidatesData?.matched || candidatesData.matched.length === 0) && 
         (!candidatesData?.unmatched || candidatesData.unmatched.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('noCandidatesTitle')}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('noCandidatesDescription')}</p>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        jobPostingId={id || ''}
        jobPostingTitle={jobPosting.title}
        onSuccess={() => {
          // Refresh data if needed
          refetchCandidates();
        }}
      />
    </div>
  );
}

function PageSkeleton() {
    return (
        <div className="container mx-auto p-8">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6 mb-6" />
            <div className="flex flex-wrap gap-2 mb-8">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        </div>
    )
}
