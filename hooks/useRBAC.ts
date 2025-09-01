import { useSession } from 'next-auth/react';
import { UserRole, Permission, rolePermissions } from '@/types/rbac';

export function useRBAC() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role as UserRole | undefined;

  const userPermissions = userRole ? rolePermissions[userRole] : [];

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(p => userPermissions.includes(p));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(p => userPermissions.includes(p));
  };

  const isRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAnyRole = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return {
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
}
