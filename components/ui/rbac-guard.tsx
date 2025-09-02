import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { Permission, UserRole } from '@/types/rbac';

interface RBACGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function RBACGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
  showFallback = true
}: RBACGuardProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    isRole, 
    isAnyRole,
    isLoading,
    isAuthenticated 
  } = useRBAC();

  // Loading state
  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !isAnyRole(requiredRoles)) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    // If all permissions are required
    if (!hasAllPermissions(requiredPermissions)) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
}

// Specific role-based guards
export function SuperAdminGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard requiredRoles={['super_admin']} fallback={fallback} showFallback={showFallback}>
      {children}
    </RBACGuard>
  );
}

export function HRManagerGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard requiredRoles={['hr_manager']} fallback={fallback} showFallback={showFallback}>
      {children}
    </RBACGuard>
  );
}

export function TechnicalInterviewerGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard requiredRoles={['technical_interviewer']} fallback={fallback} showFallback={showFallback}>
      {children}
    </RBACGuard>
  );
}

export function CandidateGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard requiredRoles={['candidate']} fallback={fallback} showFallback={showFallback}>
      {children}
    </RBACGuard>
  );
}

// Permission-based guards
export function CompanyManagementGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard 
      requiredPermissions={['manage_companies']} 
      fallback={fallback} 
      showFallback={showFallback}
    >
      {children}
    </RBACGuard>
  );
}

export function CandidateManagementGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard 
      requiredPermissions={['view_candidate_list']} 
      fallback={fallback} 
      showFallback={showFallback}
    >
      {children}
    </RBACGuard>
  );
}

export function InterviewManagementGuard({ children, fallback, showFallback = true }: Omit<RBACGuardProps, 'requiredPermissions' | 'requiredRoles'>) {
  return (
    <RBACGuard 
      requiredPermissions={['access_live_ide']} 
      fallback={fallback} 
      showFallback={showFallback}
    >
      {children}
    </RBACGuard>
  );
}

// Conditional rendering based on permissions
export function ConditionalRBAC({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null
}: RBACGuardProps) {
  return (
    <RBACGuard 
      requiredPermissions={requiredPermissions}
      requiredRoles={requiredRoles}
      fallback={fallback}
      showFallback={true}
    >
      {children}
    </RBACGuard>
  );
}

// Higher-order component for RBAC protection
export function withRBAC<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: Permission[] = [],
  requiredRoles: UserRole[] = [],
  fallback?: React.ReactNode
) {
  return function RBACProtectedComponent(props: P) {
    return (
      <RBACGuard
        requiredPermissions={requiredPermissions}
        requiredRoles={requiredRoles}
        fallback={fallback}
      >
        <Component {...props} />
      </RBACGuard>
    );
  };
}