'use client';

import { useState } from 'react';
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} from '@/services/api/userApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, PlusCircle, UserPlus } from 'lucide-react';
import { IUser } from '@/schemas/user.model';
import { ICompany } from '@/schemas/company.model';
import { useTranslations } from 'next-intl';
import { UserRoleBadge } from '@/components/user-role-badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { EditUserModal } from '@/components/personnel/edit-user-modal';
import { InviteUserModal } from '@/components/personnel/invite-user-modal';
import { useToast } from '@/hooks/use-toast';
import { useGetAllCompaniesQuery } from '@/services/api/companyApi';
import { InviteUserFormData, UpdateUserFormData } from '@/lib/validation-schemas';

export default function UserManagementPage() {
  const t = useTranslations('super-admin.users');
  const { toast } = useToast();
  const { data: usersData, isLoading, isError, error } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();
  const { data: companiesData } = useGetAllCompaniesQuery();
  const users = usersData || [];
  const companies = companiesData || [];

  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleOpenEditModal = (user: IUser) => {
    setSelectedUser(user);
    setEditIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setEditIsModalOpen(false);
  };

  const handleUpdateUser = async (userId: string, data: UpdateUserFormData) => {
    try {
      await updateUser({ id: userId, data }).unwrap();
      toast({
        title: t('toast.updateSuccessTitle'),
        description: t('toast.updateSuccessMessage'),
      });
      handleCloseEditModal();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('toast.updateErrorTitle'),
        description: t('toast.updateErrorMessage'),
      });
    }
  };

  const handleInviteUser = async (data: InviteUserFormData) => {
    try {
      await createUser(data).unwrap();
      toast({
        title: t('toast.inviteSuccessTitle'),
        description: t('toast.inviteSuccessMessage'),
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('toast.inviteErrorTitle'),
        description: t('toast.inviteErrorMessage'),
      });
      // Re-throw the error to prevent the modal from closing on failure
      throw err;
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('errorTitle')}</AlertTitle>
        <AlertDescription>
          {t('errorMessage')}
          {/* @ts-ignore */}
          <p className="text-xs mt-2">{error?.data?.message || error.toString()}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('addButton')}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.name')}</TableHead>
              <TableHead>{t('table.company')}</TableHead>
              <TableHead>{t('table.roles')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.createdAt')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{(user.companyId as ICompany)?.name || t('noCompany')}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => <UserRoleBadge key={role} role={role} />)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? t('status.active') : t('status.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: tr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(user)}>
                      {t('editButton')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {isEditModalOpen && (
        <EditUserModal
          key={selectedUser?._id || 'edit-user'}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onUpdate={handleUpdateUser}
          companies={companies}
          t={(key) => t(`editModal.${key}`)}
        />
      )}
      
      {isInviteModalOpen && (
        <InviteUserModal
          key="invite-user"
          isOpen={isInviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInviteUser}
          companies={companies}
          t={(key) => t(`inviteModal.${key}`)}
        />
      )}
    </div>
  );
}
