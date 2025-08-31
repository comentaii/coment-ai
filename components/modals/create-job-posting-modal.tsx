'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JobPostingForm } from '@/components/forms/job-posting-form';
import { useCreateJobPostingMutation } from '@/services/api/job-posting-api';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { CreateJobPostingDto } from '@/lib/validation-schemas';
import { FormikHelpers } from 'formik';

interface CreateJobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateJobPostingModal({ isOpen, onClose, onSuccess }: CreateJobPostingModalProps) {
  const t = useTranslations('CreateJobPostingModal');
  const [createJobPosting, { isLoading }] = useCreateJobPostingMutation();
  const { success, error } = useToast();

  const handleSubmit = async (values: CreateJobPostingDto, { resetForm }: FormikHelpers<CreateJobPostingDto>) => {
    try {
      await createJobPosting(values).unwrap();
      success(t('toast.success', { title: values.title }));
      resetForm();
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || t('toast.defaultError');
      error(errorMessage);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('descriptionAI')}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <JobPostingForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
