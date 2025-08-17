import { Badge } from '@/components/ui/badge';

interface UserRoleBadgeProps {
  role: string;
}

const roleConfig = {
  super_admin: {
    label: 'Süper Admin',
    className: 'bg-custom-red text-white dark:bg-custom-red dark:text-white',
  },
  hr_manager: {
    label: 'İK Yetkilisi',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  technical_interviewer: {
    label: 'Teknik Mülakatçı',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  candidate: {
    label: 'Aday',
    className: 'bg-brand-green text-white dark:bg-brand-green dark:text-white',
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.candidate;

  return (
    <Badge className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
} 