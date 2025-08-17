'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FormikForm } from './formik-form';
import { FormikField } from './formik-field';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userSignupSchema, UserSignupFormData } from '@/lib/validation-schemas';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: UserSignupFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    companyName: '',
    companyEmail: '',
  };

  const handleSubmit = async (values: UserSignupFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page after successful signup
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        router.push('/tr/auth/signin');
        onSuccess?.();
      } else {
        throw new Error(data.message || 'Kayıt işlemi başarısız');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormikForm
      initialValues={initialValues}
      validationSchema={userSignupSchema}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {(formikProps) => (
        <>
          <FormikField
            name="name"
            label={t('name')}
            placeholder="Ad Soyad"
            error={formikProps.errors.name}
            touched={formikProps.touched.name}
          />

          <FormikField
            name="email"
            label={t('email')}
            type="email"
            placeholder="ornek@email.com"
            error={formikProps.errors.email}
            touched={formikProps.touched.email}
          />

          <FormikField
            name="password"
            label={t('password')}
            type="password"
            placeholder="••••••"
            error={formikProps.errors.password}
            touched={formikProps.touched.password}
          />

          <FormikField
            name="confirmPassword"
            label={t('confirmPassword')}
            type="password"
            placeholder="••••••"
            error={formikProps.errors.confirmPassword}
            touched={formikProps.touched.confirmPassword}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Rol</label>
            <Select
              value={formikProps.values.role}
              onValueChange={(value) => {
                formikProps.setFieldValue('role', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidate">Aday</SelectItem>
                <SelectItem value="hr_manager">İK Yetkilisi</SelectItem>
                <SelectItem value="technical_interviewer">Teknik Mülakatçı</SelectItem>
              </SelectContent>
            </Select>
            {formikProps.errors.role && formikProps.touched.role && (
              <p className="text-sm text-red-500">{formikProps.errors.role}</p>
            )}
          </div>

          {(formikProps.values.role === 'hr_manager' || formikProps.values.role === 'technical_interviewer') && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Şirket Bilgileri (Opsiyonel)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Şirket bilgilerinizi girerek şirketinizle ilişkilendirilebilirsiniz.
              </p>
              
              <FormikField
                name="companyName"
                label="Şirket Adı"
                placeholder="Şirket adınız (opsiyonel)"
                error={formikProps.errors.companyName}
                touched={formikProps.touched.companyName}
              />

              <FormikField
                name="companyEmail"
                label="Şirket Email"
                type="email"
                placeholder="sirket@email.com (opsiyonel)"
                error={formikProps.errors.companyEmail}
                touched={formikProps.touched.companyEmail}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Kayıt olunuyor...' : t('register')}
          </Button>
        </>
      )}
    </FormikForm>
  );
} 