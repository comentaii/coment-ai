'use client';

import { useState } from 'react';
// import { useTranslations } from 'next-intl';
import { Plus, Users, UserCheck, UserX, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InviteUserModal } from '@/components/personnel/invite-user-modal';
import { EditUserRolesModal } from '@/components/personnel/edit-user-roles-modal';
import { SimpleConfirmationDialog } from '@/components/ui/simple-confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { ROLE_LABELS } from '@/lib/constants/roles';
import { IUser } from '@/schemas/user.model';
import { 
  useGetPersonnelQuery, 
  useInviteUserMutation, 
  useUpdateUserRolesMutation, 
  useDeactivateUserMutation 
} from '@/services/api/personnelApi';

export default function PersonnelPage() {
  // const t = useTranslations('PersonnelPage');
  const { promise } = useToast();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // API hooks
  const { data: personnelData } = useGetPersonnelQuery();
  const [inviteUser] = useInviteUserMutation();
  const [updateUserRoles] = useUpdateUserRolesMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const users = personnelData?.users || [];

  const handleInviteUser = async (userData: any) => {
    await promise(
      inviteUser(userData).unwrap(),
      {
        loading: 'Kullanıcı davet ediliyor...',
        success: 'Kullanıcı başarıyla davet edildi!',
        error: 'Kullanıcı davet edilemedi'
      }
    );
    setIsInviteModalOpen(false);
  };

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUserRoles = async (userId: string, roles: string[]) => {
    await promise(
      updateUserRoles({ id: userId, data: { roles } }).unwrap(),
      {
        loading: 'Kullanıcı rolleri güncelleniyor...',
        success: 'Kullanıcı rolleri başarıyla güncellendi!',
        error: 'Kullanıcı rolleri güncellenemedi'
      }
    );
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user: IUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    await promise(
      deactivateUser(selectedUser._id as string).unwrap(),
      {
        loading: 'Kullanıcı deaktive ediliyor...',
        success: 'Kullanıcı başarıyla deaktive edildi!',
        error: 'Kullanıcı deaktive edilemedi'
      }
    );
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => (
      <Badge key={role} variant="secondary" className="mr-1">
        {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
      </Badge>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Personel Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Şirketinizdeki kullanıcıları yönetin ve rollerini düzenleyin
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Kullanıcı Davet Et
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                         <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Aktif kullanıcı sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İK Yetkilileri</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                         <div className="text-2xl font-bold">
               {users.filter(u => u.roles.includes('hr_manager')).length}
             </div>
            <p className="text-xs text-muted-foreground">
              İK yetkisi olan kullanıcılar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mülakatçılar</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                         <div className="text-2xl font-bold">
               {users.filter(u => u.roles.includes('technical_interviewer')).length}
             </div>
            <p className="text-xs text-muted-foreground">
              Mülakat yapabilen kullanıcılar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
          <CardDescription>
            Şirketinizdeki tüm kullanıcıları görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roller</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
                         <TableBody>
               {users.map((user) => (
                <TableRow key={user._id as string}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap">
                      {getRoleBadges(user.roles)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />

      <EditUserRolesModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUpdate={handleUpdateUserRoles}
      />

      <SimpleConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Kullanıcıyı Deaktive Et"
        description={`${selectedUser?.name} kullanıcısını deaktive etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Deaktive Et"
        cancelText="İptal"
      />
    </div>
  );
}
