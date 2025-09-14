'use client';

import { useState, useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { PlusCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button, FormSubmitButton } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormikField, FormikSelect } from '@/components/ui/formik-form';
import { companySchema, CompanyFormData } from '@/lib/validation-schemas';
import { ICompany } from '@/schemas/company.model';

type T = (key: string) => string;

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  company?: ICompany | null;
  t: T;
}

export function CompanyFormModal({ isOpen, onClose, onSubmit, company, t }: CompanyFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!company;


  const initialValues: CompanyFormData = useMemo(() => ({
    name: company?.name || '',
    email: company?.email || '',
    subscriptionPlan: company?.subscriptionPlan || 'basic',
    isActive: company?.isActive ?? true,
    quotas: {
      cvUploads: company?.quotas?.cvUploads || 100,
      interviews: company?.quotas?.interviews || 50,
      storageGB: company?.quotas?.storageGB || 10,
    },
  }), [company]);

  const handleSubmit = async (
    values: CompanyFormData,
    { resetForm }: FormikHelpers<CompanyFormData>
  ) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      onClose();
      resetForm();
    } catch (error) {
      console.error(isEditMode ? 'Error updating company:' : 'Error creating company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionOptions = [
    { value: 'basic', label: t('plans.basic') },
    { value: 'premium', label: t('plans.premium') },
    { value: 'enterprise', label: t('plans.enterprise') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isEditMode ? <Edit className="w-5 h-5 mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />}
            {isEditMode ? t('editTitle') : t('addTitle')}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={companySchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formikProps) => {
            return (
              <Form className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label>{t('statusLabel')}</Label>
                  </div>
                  <Switch
                    checked={formikProps.values.isActive}
                    onCheckedChange={(checked) => formikProps.setFieldValue('isActive', checked)}
                  />
                </div>

                <FormikField name="name" label={t('nameLabel')} error={formikProps.errors.name} touched={formikProps.touched.name} />
                <FormikField name="email" type="email" label={t('emailLabel')} error={formikProps.errors.email} touched={formikProps.touched.email} />

                <FormikSelect
                  name="subscriptionPlan"
                  label={t('planLabel')}
                  options={subscriptionOptions}
                  error={formikProps.errors.subscriptionPlan}
                  touched={formikProps.touched.subscriptionPlan}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormikField name="quotas.cvUploads" label={t('cvQuotaLabel')} type="number" error={formikProps.errors.quotas?.cvUploads} touched={formikProps.touched.quotas?.cvUploads} />
                  <FormikField name="quotas.interviews" label={t('interviewQuotaLabel')} type="number" error={formikProps.errors.quotas?.interviews} touched={formikProps.touched.quotas?.interviews} />
                  <FormikField name="quotas.storageGB" label={t('storageQuotaLabel')} type="number" error={formikProps.errors.quotas?.storageGB} touched={formikProps.touched.quotas?.storageGB} />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    {t('cancelButton')}
                  </Button>
                  <FormSubmitButton loading={isLoading} disabled={!formikProps.dirty}>
                    {isEditMode ? t('updateButton') : t('addButton')}
                  </FormSubmitButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
