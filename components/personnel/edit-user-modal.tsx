'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button, FormSubmitButton } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { FormikSelect } from '@/components/ui/formik-form';
import { updateUserSchema, UpdateUserFormData } from '@/lib/validation-schemas';
import { ROLE_LABELS, USER_ROLES } from '@/lib/constants/roles';
import { IUser } from '@/schemas/user.model';
import { ICompany } from '@/schemas/company.model';

type T = (key: string) => string;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onUpdate: (userId: string, data: UpdateUserFormData) => Promise<void>;
  companies: ICompany[];
  t: T;
}

export function EditUserModal({ isOpen, onClose, user, onUpdate, companies, t }: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: UpdateUserFormData = {
    roles: user?.roles || [],
    companyId: user?.companyId || null,
    isActive: user?.isActive ?? true,
  };

  const handleSubmit = async (
    values: UpdateUserFormData,
    { resetForm }: FormikHelpers<UpdateUserFormData>
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await onUpdate(user._id, values);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const companyOptions = companies.map(company => ({
    value: company._id,
    label: company.name,
  }));
  
  const availableRoles = Object.values(USER_ROLES);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={updateUserSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {(formikProps) => {
              useEffect(() => {
                formikProps.resetForm({ values: initialValues });
              }, [user]);
              
              return (
                <Form className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>{t('statusLabel')}</Label>
                      <p className="text-xs text-muted-foreground">{t('statusDescription')}</p>
                    </div>
                    <Switch
                      checked={formikProps.values.isActive}
                      onCheckedChange={(checked) => formikProps.setFieldValue('isActive', checked)}
                    />
                  </div>

                  <FormikSelect
                    name="companyId"
                    label={t('companyLabel')}
                    placeholder={t('companyPlaceholder')}
                    options={companyOptions}
                    error={formikProps.errors.companyId}
                    touched={formikProps.touched.companyId}
                  />

                  <div>
                    <Label>{t('rolesLabel')}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2">
                      {availableRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={formikProps.values.roles.includes(role)}
                            onCheckedChange={(checked) => {
                              const currentRoles = formikProps.values.roles;
                              const newRoles = checked
                                ? [...currentRoles, role]
                                : currentRoles.filter((r) => r !== role);
                              formikProps.setFieldValue('roles', newRoles);
                            }}
                          />
                          <Label htmlFor={role} className="text-sm font-normal whitespace-nowrap">
                            {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formikProps.touched.roles && formikProps.errors.roles && (
                      <p className="text-sm text-red-500 mt-2">{formikProps.errors.roles as string}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      {t('cancelButton')}
                    </Button>
                    <FormSubmitButton loading={isLoading} disabled={!formikProps.dirty}>
                      {isLoading ? t('updatingButton') : t('updateButton')}
                    </FormSubmitButton>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
}
