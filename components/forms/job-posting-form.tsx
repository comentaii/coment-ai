'use client';

import { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { CreateJobPostingDto, createJobPostingSchema } from '@/lib/validation-schemas';
import { FormikField } from '@/components/forms/formik-field';
import { FormSubmitButton } from '@/components/ui/button';
import { TagInput } from '@/components/ui/tag-input';
import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from '@/components/ui/label';

const initialValues: CreateJobPostingDto = {
  title: '',
  description: '',
  skills: [],
  linkedinUrl: '',
};

const stripHtml = (html: string) => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

interface JobPostingFormProps {
  onSubmit: (values: CreateJobPostingDto, helpers: FormikHelpers<CreateJobPostingDto>) => Promise<void>;
  isLoading: boolean;
}

export function JobPostingForm({ onSubmit, isLoading }: JobPostingFormProps) {
  const t = useTranslations('JobPostingForm');
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const { toast } = useToast();

  const handleParseText = async (setFieldValue: any) => {
    if (!rawText) {
      toast.error('Metin Gerekli', {
        description: 'Lütfen analiz için bir iş ilanı metni yapıştırın.',
      });
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch('/api/ai-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu.');
      }
      
      setFieldValue('title', data.data.title);
      setFieldValue('description', stripHtml(data.data.description));
      setFieldValue('skills', data.data.skills);
      setIsParsed(true); // Show the form fields

      toast.success('Analiz Başarılı!', {
        description: 'İlan bilgileri metinden başarıyla çıkarıldı. Lütfen kontrol edip kaydedin.',
      });

    } catch (error: any) {
      toast.error('Analiz Hatası!', {
        description: error.message,
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createJobPostingSchema}
      onSubmit={onSubmit}
      enableReinitialize // Allows form to update when initialValues change (after parsing)
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="space-y-6">
          {!isParsed ? (
            <div className="space-y-4">
              <Label htmlFor="rawText">İş İlanı Metni</Label>
              <Textarea
                id="rawText"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="İş ilanıyla ilgili tüm metni buraya yapıştırın..."
                rows={12}
                className="transition-all duration-300 focus:ring-2 focus:ring-brand-green"
              />
              <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle>Yapay Zeka Destekli Doldurma</AlertTitle>
                <AlertDescription>
                  Herhangi bir yerden kopyaladığınız iş ilanı metnini yukarıdaki alana yapıştırın. Yapay zeka, ilanın başlığını, açıklamasını ve gerekli yetenekleri sizin için otomatik olarak ayrıştıracaktır.
                </AlertDescription>
              </Alert>
              <Button type="button" onClick={() => handleParseText(setFieldValue)} disabled={isParsing} className="w-full">
                {isParsing ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <ArrowRight className="h-4 w-4 mr-2"/>}
                {isParsing ? 'Analiz Ediliyor...' : 'Analiz Et ve Formu Doldur'}
              </Button>
            </div>
          ) : (
            <>
              <FormikField 
                name="title" 
                label={t('titleLabel')}
                placeholder={t('titlePlaceholder')}
                isRequired
              />
              <FormikField
                name="description"
                label={t('descriptionLabel')}
                placeholder={t('descriptionPlaceholder')}
                as="textarea"
                rows={8}
                isRequired
              />
              <div>
                <Label htmlFor="skills" isRequired>{t('skillsLabel')}</Label>
                <TagInput
                  id="skills"
                  value={values.skills}
                  onChange={(newSkills) => setFieldValue('skills', newSkills)}
                  placeholder={t('skillsPlaceholder')}
                />
                {touched.skills && errors.skills && (
                  <p className="text-sm text-red-500 mt-1">{errors.skills}</p>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <FormSubmitButton loading={isLoading}>
                  {t('submitButton')}
                </FormSubmitButton>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}
