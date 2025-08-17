'use client';

import { Formik, Form } from 'formik';
import { ReactNode } from 'react';
import * as Yup from 'yup';

interface FormikFormWrapperProps<T> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: (formikProps: any) => ReactNode;
  className?: string;
}

export function FormikForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className,
}: FormikFormWrapperProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <Form className={className}>
          {children(formikProps)}
        </Form>
      )}
    </Formik>
  );
} 