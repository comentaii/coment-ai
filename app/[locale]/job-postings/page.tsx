'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGetJobPostingsQuery } from '@/services/api/job-posting-api';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader, AlertTriangle } from 'lucide-react';
import { JobPostingCard, JobPostingCardSkeleton } from '@/components/job-postings/job-posting-card';
import { CreateJobPostingModal } from '@/components/modals/create-job-posting-modal';

export default function JobPostingsPage() {
  const t = useTranslations('JobPostingsPage');
  const { data: jobPostings, isLoading, isError, error, refetch } = useGetJobPostingsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobPostingCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-300">{t('errorTitle')}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('errorMessage')}
          </p>
        </div>
      );
    }

    if (!jobPostings || jobPostings.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('noPostingsTitle')}</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('noPostingsDescription')}</p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-6">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('createFirstButton')}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobPostings.map((posting) => (
          <JobPostingCard key={posting._id} jobPosting={posting} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mt-1 text-md text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('createNewButton')}
        </Button>
      </div>

      {renderContent()}

      <CreateJobPostingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}
