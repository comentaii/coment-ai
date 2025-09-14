'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { USER_ROLES, ROLE_LABELS } from '@/lib/constants/roles';
import { IUser } from '@/schemas/user.model';

interface EditUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onUpdate: (userId: string, roles: string[]) => Promise<void>;
}

export function EditUserRolesModal({ isOpen, onClose, user, onUpdate }: EditUserRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles || []);
    }
  }, [user]);

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, role]);
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await onUpdate(user._id as string, selectedRoles);
      onClose();
    } catch (error) {
      console.error('Error updating user roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableRoles = [
    USER_ROLES.HR_MANAGER,
    USER_ROLES.TECHNICAL_INTERVIEWER,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kullanıcı Rollerini Düzenle</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kullanıcı Bilgileri</Label>
            <div className="text-sm text-muted-foreground">
              <p><strong>Ad:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Roller</Label>
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                />
                <Label
                  htmlFor={role}
                  className="text-sm font-normal cursor-pointer"
                >
                  {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || selectedRoles.length === 0}
          >
            {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
