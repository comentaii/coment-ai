import { useSession } from 'next-auth/react';
import { UserRole, Permission, rolePermissions } from '@/types/rbac';

export function useRBAC() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const userRoles = (session?.user as any)?.roles as UserRole[] | undefined;
  const primaryRole = userRoles && userRoles.length > 0 ? userRoles[0] : undefined;

  const userPermissions: Permission[] = (userRoles && userRoles.length)
    ? Array.from(new Set(userRoles.flatMap((r) => rolePermissions[r] || [])))
    : [];

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
    return (userRoles || []).includes(role);
  };

  const isAnyRole = (roles: UserRole[]): boolean => {
    if (!userRoles || userRoles.length === 0) return false;
    return roles.some((r) => userRoles.includes(r));
  };

  return {
    userRole: (primaryRole as UserRole | undefined),
    userRoles,
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
