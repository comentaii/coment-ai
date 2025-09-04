'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { X, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormikForm } from '@/components/ui/formik-form';
import { updateUserRolesSchema, UpdateUserRolesFormData } from '@/lib/validation-schemas';
import { ROLE_LABELS } from '@/lib/constants/roles';
import { IUser } from '@/schemas/user.model';

interface EditUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onUpdate: (userId: string, roles: string[]) => Promise<void>;
}

export function EditUserRolesModal({ isOpen, onClose, user, onUpdate }: EditUserRolesModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<UpdateUserRolesFormData>({
    initialValues: {
      roles: [],
    },
    validationSchema: updateUserRolesSchema,
    onSubmit: async (values) => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        await onUpdate(user._id, values.roles);
        formik.resetForm();
      } catch (error) {
        console.error('Error updating user roles:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      formik.setFieldValue('roles', user.roles);
    }
  }, [user]);

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
    { value: 'candidate', label: ROLE_LABELS.candidate },
  ];

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Kullanıcı Rollerini Düzenle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <FormikForm
            initialValues={formik.initialValues}
            validationSchema={updateUserRolesSchema}
            onSubmit={formik.handleSubmit}
          >
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

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Uyarı:</strong> Rol değişiklikleri anında etkili olacaktır. Kullanıcının erişim yetkileri değişecektir.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </FormikForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}

