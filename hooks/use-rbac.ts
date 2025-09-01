import { useAuth } from './use-auth';
import { UserRole, Permission, ROLES_PERMISSIONS } from '@/types/rbac';
import { useCallback } from 'react';

export const useRBAC = () => {
  const { user, status } = useAuth();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const userRole = user?.role || 'guest';

  const userPermissions = ROLES_PERMISSIONS[userRole as UserRole] || [];

  const hasPermission = useCallback((permission: Permission) => {
    return userPermissions.includes(permission);
  }, [userPermissions]);

  const hasAnyPermission = useCallback((permissions: Permission[]) => {
    return permissions.some(p => userPermissions.includes(p));
  }, [userPermissions]);

  const hasAllPermissions = useCallback((permissions: Permission[]) => {
    return permissions.every(p => userPermissions.includes(p));
  }, [userPermissions]);

  const isRole = useCallback((role: UserRole) => {
    return userRole === role;
  }, [userRole]);

  const isAnyRole = useCallback((roles: UserRole[]) => {
    return roles.includes(userRole as UserRole);
  }, [userRole]);

  return {
    user,
    userRole,
    userPermissions,
    isLoading,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAnyRole,
  };
};
