import { useAuth } from './use-auth';
import { UserRole, Permission, ROLES_PERMISSIONS } from '@/types/rbac';
import { useCallback, useMemo } from 'react';

export const useRBAC = () => {
  const { user, status } = useAuth();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const userRoles = (user?.roles as UserRole[] | undefined) ?? [];
  const primaryRole = userRoles[0] ?? 'candidate';

  const userPermissions = useMemo(() => {
    if (!userRoles.length) return ROLES_PERMISSIONS['candidate'];
    const merged = new Set<Permission>();
    userRoles.forEach((r) => {
      (ROLES_PERMISSIONS[r] || []).forEach((p) => merged.add(p));
    });
    return Array.from(merged);
  }, [userRoles]);

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
    return userRoles.includes(role);
  }, [userRoles]);

  const isAnyRole = useCallback((roles: UserRole[]) => {
    return roles.some((r) => userRoles.includes(r));
  }, [userRoles]);

  return {
    user,
    userRole: primaryRole,
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
};
