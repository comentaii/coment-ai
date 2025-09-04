"use client";

import React from 'react';
import { Formik, Form, Field, useFormikContext, FormikProps, FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Formik Field Component
interface FormikFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const FormikField: React.FC<FormikFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  className,
  error,
  touched,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "w-full",
          error && touched && "border-red-500 focus:border-red-500",
          className
        )}
      />
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Formik Textarea Component
interface FormikTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const FormikTextarea: React.FC<FormikTextareaProps> = ({
  name,
  label,
  placeholder,
  rows = 4,
  required = false,
  className,
  error,
  touched,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
      )}
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full",
          error && touched && "border-red-500 focus:border-red-500",
          className
        )}
      />
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Formik Select Component
interface FormikSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  error?: string;
  touched?: boolean | undefined;
  disabled?: boolean;
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  label,
  placeholder,
  options,
  required = false,
  className,
  error,
  touched,
  disabled = false,
}) => {
  const { setFieldValue, values } = useFormikContext<any>();

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
      )}
      <Select
        name={name}
        value={values[name]}
        onValueChange={(value) => {
          setFieldValue(name, value);
        }}
        disabled={disabled}
      >
        <SelectTrigger className={cn(
          "w-full",
          error && touched && "border-red-500 focus:border-red-500",
          className
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Formik Checkbox Component
interface FormikCheckboxProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  name,
  label,
  required = false,
  className,
  error,
  touched,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          name={name}
          className={cn(
            error && touched && "border-red-500",
            className
          )}
        />
        {label && (
          <Label htmlFor={name} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
            {label}
          </Label>
        )}
      </div>
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Formik Form Wrapper
interface FormikFormProps<T> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
  children: (formikProps: FormikProps<T>) => React.ReactNode;
  className?: string;
  enableReinitialize?: boolean;
}

export function FormikForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className,
  enableReinitialize = false,
}: FormikFormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {(formikProps) => (
        <Form className={cn("space-y-6", className)}>
          {children(formikProps)}
        </Form>
      )}
    </Formik>
  );
}

// Form Submit Button
interface FormSubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  className,
  variant = 'default',
  size = 'default',
}) => {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={className}
      variant={variant}
      size={size}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Button>
  );
};

// Form Error Display
interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className }) => {
  if (!error) return null;
  
  return (
    <div className={cn("p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md", className)}>
      {error}
    </div>
  );
};

// Form Success Display
interface FormSuccessProps {
  message?: string;
  className?: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ message, className }) => {
  if (!message) return null;
  
  return (
    <div className={cn("p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md", className)}>
      {message}
    </div>
  );
}; 