'use client';

import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormikFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string | undefined;
  touched?: boolean | undefined;
}

export function FormikField({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  touched,
}: FormikFieldProps) {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        className={(error || meta.error) && (touched || meta.touched) ? 'border-red-500' : ''}
      />
      {(error || meta.error) && (touched || meta.touched) && (
        <p className="text-sm text-red-500">{error || meta.error}</p>
      )}
    </div>
  );
} 