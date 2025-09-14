'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormikForm } from '@/components/ui/formik-form';
import { FormikField } from '@/components/forms/formik-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {  UserSignupFormData, userSignupSchema } from '@/lib/validation-schemas';
import { useToast } from '@/hooks/use-toast';
import { USER_ROLES } from '@/lib/constants/roles';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: UserSignupFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['candidate'],
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('signupErrorDefault'));
      }

      success(t('signupSuccessDescription'));
      
      // Automatically sign in the user after successful signup
      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/tr/dashboard');
        onSuccess?.();
      } else {
        // If auto sign-in fails, redirect to sign-in page
        router.push('/tr/auth/signin');
      }
    } catch (err: any) {
      showError(err.message);
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

          <div className="space-y-3">
            <label className="text-sm font-medium">Roller</label>
            <div className="space-y-2">
              {[
                { value: USER_ROLES.CANDIDATE, label: 'Aday' },
                { value: USER_ROLES.HR_MANAGER, label: 'İK Yetkilisi' },
                { value: USER_ROLES.TECHNICAL_INTERVIEWER, label: 'Teknik Mülakatçı' },
              ].map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={formikProps.values.roles?.includes(role.value) || false}
                    onCheckedChange={(checked) => {
                      const currentRoles = formikProps.values.roles || [];
                      if (checked) {
                        formikProps.setFieldValue('roles', [...currentRoles, role.value]);
                      } else {
                        formikProps.setFieldValue('roles', currentRoles.filter(r => r !== role.value));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`role-${role.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
            {formikProps.errors.roles && formikProps.touched.roles && (
              <p className="text-sm text-red-500">{formikProps.errors.roles}</p>
            )}
          </div>

          {(formikProps.values.roles?.includes(USER_ROLES.HR_MANAGER) || formikProps.values.roles?.includes(USER_ROLES.TECHNICAL_INTERVIEWER)) && (
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