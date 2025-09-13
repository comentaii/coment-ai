'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { FormikHelpers } from 'formik';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormikForm, FormikField, FormikSelect } from '@/components/ui/formik-form';
import { Button, FormSubmitButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { inviteUserSchema, InviteUserFormData } from '@/lib/validation-schemas';
import { ROLE_LABELS, USER_ROLES } from '@/lib/constants/roles';
import { ICompany } from '@/schemas/company.model';

type T = (key: string) => string;

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteUserFormData) => Promise<void>;
  companies: ICompany[];
  t: T;
}

export function InviteUserModal({ isOpen, onClose, onInvite, companies, t }: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: InviteUserFormData = {
    name: '',
    email: '',
    roles: [],
    companyId: '',
  };

  const handleSubmit = async (
    values: InviteUserFormData,
    { resetForm }: FormikHelpers<InviteUserFormData>
  ) => {
    setIsLoading(true);
    try {
      await onInvite(values);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const companyOptions = companies.map(company => ({
    value: company._id,
    label: company.name,
  }));
  
  const availableRoles = [
    USER_ROLES.HR_MANAGER,
    USER_ROLES.TECHNICAL_INTERVIEWER,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <FormikForm
          initialValues={initialValues}
          validationSchema={inviteUserSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <>
              <FormikField
                name="name"
                label={t('nameLabel')}
                placeholder={t('namePlaceholder')}
                error={formikProps.errors.name}
                touched={formikProps.touched.name}
              />
              <FormikField
                name="email"
                type="email"
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                error={formikProps.errors.email}
                touched={formikProps.touched.email}
              />
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
                <div className="space-y-2 mt-2">
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
                      <Label htmlFor={role} className="text-sm font-normal">
                        {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
                      </Label>
                    </div>
                  ))}
                </div>
                {formikProps.errors.roles && formikProps.touched.roles && (
                  <p className="text-sm text-red-500 mt-1">{formikProps.errors.roles as string}</p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>{t('infoTitle')}:</strong> {t('infoMessage')}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t('cancelButton')}
                </Button>
                <FormSubmitButton loading={isLoading}>
                  {t('inviteButton')}
                </FormSubmitButton>
              </div>
            </>
          )}
        </FormikForm>
      </DialogContent>
    </Dialog>
  );
}

