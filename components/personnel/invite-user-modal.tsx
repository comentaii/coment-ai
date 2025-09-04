'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { X, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormikForm } from '@/components/ui/formik-form';
import { inviteUserSchema, InviteUserFormData } from '@/lib/validation-schemas';
import { ROLE_LABELS } from '@/lib/constants/roles';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteUserFormData) => Promise<void>;
}

export function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<InviteUserFormData>({
    initialValues: {
      name: '',
      email: '',
      roles: [],
    },
    validationSchema: inviteUserSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onInvite(values);
        formik.resetForm();
      } catch (error) {
        console.error('Error inviting user:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleRoleChange = (role: string, checked: boolean) => {
    const currentRoles = formik.values.roles;
    if (checked) {
      formik.setFieldValue('roles', [...currentRoles, role]);
    } else {
      formik.setFieldValue('roles', currentRoles.filter(r => r !== role));
    }
  };

  const availableRoles = [
    { value: 'hr_manager', label: ROLE_LABELS.hr_manager },
    { value: 'technical_interviewer', label: ROLE_LABELS.technical_interviewer },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Kullanıcı Davet Et
          </DialogTitle>
        </DialogHeader>

        <FormikForm
          initialValues={formik.initialValues}
          validationSchema={inviteUserSchema}
          onSubmit={formik.handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Kullanıcının adı ve soyadı"
                className={formik.errors.name && formik.touched.name ? 'border-red-500' : ''}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Adresi</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="ornek@company.com"
                className={formik.errors.email && formik.touched.email ? 'border-red-500' : ''}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <Label>Roller</Label>
              <div className="space-y-2 mt-2">
                {availableRoles.map((role) => (
                  <div key={role.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={role.value}
                      checked={formik.values.roles.includes(role.value)}
                      onCheckedChange={(checked) => handleRoleChange(role.value, checked as boolean)}
                    />
                    <Label htmlFor={role.value} className="text-sm font-normal">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formik.errors.roles && formik.touched.roles && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.roles}</p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Bilgi:</strong> Davet edilen kullanıcıya geçici bir şifre ile giriş bilgileri e-posta ile gönderilecektir.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Davet Ediliyor...' : 'Davet Et'}
              </Button>
            </div>
          </div>
        </FormikForm>
      </DialogContent>
    </Dialog>
  );
}

