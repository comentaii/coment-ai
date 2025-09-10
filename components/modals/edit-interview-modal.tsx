'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useUpdateInterviewSessionMutation } from '@/services/api/interviewApi';
import { useToast } from '@/hooks/use-toast';

const EditInterviewSchema = Yup.object().shape({
  scheduledDate: Yup.date().required('Tarih gereklidir'),
  notes: Yup.string(),
});

export function EditInterviewModal({ session, isOpen, onClose }) {
  const t = useTranslations('EditInterviewModal');
  const { toast } = useToast();
  const [updateInterview, { isLoading }] = useUpdateInterviewSessionMutation();

  const formik = useFormik({
    initialValues: {
      scheduledDate: session ? new Date(session.scheduledDate).toISOString().substring(0, 16) : '',
      notes: session?.notes || '',
    },
    validationSchema: EditInterviewSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateInterview({ id: session._id, ...values }).unwrap();
        toast.success(t('updateSuccess'));
        onClose();
      } catch (error) {
        toast.error(t('updateError'));
      }
    },
  });

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="scheduledDate">{t('scheduledDate')}</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="datetime-local"
                onChange={formik.handleChange}
                value={formik.values.scheduledDate}
              />
              {formik.errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{formik.errors.scheduledDate}</p>}
            </div>
            <div>
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                name="notes"
                onChange={formik.handleChange}
                value={formik.values.notes}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? t('saving') : t('save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
