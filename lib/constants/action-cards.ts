import { 
  Calendar, 
  User, 
  Settings, 
  FileText, 
  Code, 
  BarChart3,
  Building,
  Users
} from 'lucide-react';
import { USER_ROLES, type UserRole } from './roles';

export interface ActionCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string; // locale olmadan path
  color: string;
  roles: UserRole[];
}

export const ACTION_CARDS: ActionCard[] = [
  {
    title: 'Profilim',
    description: 'Hesap bilgilerinizi yönetin',
    icon: User,
    path: '/profile',
    color: 'bg-blue-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  {
    title: 'Ayarlar',
    description: 'Sistem ayarlarınızı düzenleyin',
    icon: Settings,
    path: '/settings',
    color: 'bg-gray-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  {
    title: 'Mülakatlarım',
    description: 'Mülakat geçmişinizi görüntüleyin',
    icon: Calendar,
    path: '/my-interviews',
    color: 'bg-green-500',
    roles: [USER_ROLES.CANDIDATE],
  },
  {
    title: 'Adaylar',
    description: 'Aday yönetimi ve listesi',
    icon: Users,
    path: '/candidates',
    color: 'bg-purple-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    title: 'Mülakatlar',
    description: 'Mülakat planlama ve yönetimi',
    icon: Calendar,
    path: '/interviews',
    color: 'bg-orange-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    title: 'CV Analizi',
    description: 'CV değerlendirme ve analiz',
    icon: FileText,
    path: '/cv-analysis',
    color: 'bg-indigo-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    title: 'Kod Değerlendirme',
    description: 'Kod analizi ve puanlama',
    icon: Code,
    path: '/code-review',
    color: 'bg-red-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    title: 'Firmalar',
    description: 'Firma yönetimi',
    icon: Building,
    path: '/companies',
    color: 'bg-yellow-500',
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    title: 'Analitik',
    description: 'İstatistikler ve raporlar',
    icon: BarChart3,
    path: '/analytics',
    color: 'bg-teal-500',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
];

export const getActionCardsByRole = (role: UserRole): ActionCard[] => {
  return ACTION_CARDS.filter(card => card.roles.includes(role));
};
