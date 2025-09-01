'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema, LoginDto } from '@/lib/validation-schemas';
import { FormikForm } from '@/components/ui/formik-form';
import { FormikField } from '@/components/forms/formik-field';
import { Button } from '@/components/ui/button';
import { FormSubmitButton } from '@/components/ui/button';
import { FormError, FormSuccess } from '@/components/ui/form';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('Auth');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const initialValues: LoginDto = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginDto) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/tr/dashboard' });
    } catch (error) {
      console.error('Google login error:', error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormikForm
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {(formikProps) => (
          <>
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş yapılıyor...' : t('login')}
            </Button>
          </>
        )}
      </FormikForm>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Veya
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? 'Google ile giriş yapılıyor...' : 'Google ile Giriş Yap'}
      </Button>
    </div>
  );
} 