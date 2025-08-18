import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, type UserRole } from '@/lib/constants/roles';

interface UserRoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

const roleConfig = {
  super_admin: {
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
  },
  hr_manager: {
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  },
  technical_interviewer: {
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800',
  },
  candidate: {
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
  },
};

export function UserRoleBadge({ role, size = 'md' }: UserRoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.candidate;
  const label = ROLE_LABELS[role as UserRole] || ROLE_LABELS.candidate;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge className={`font-medium border ${config.className} ${sizeClasses[size]}`}>
      {label}
    </Badge>
  );
} 