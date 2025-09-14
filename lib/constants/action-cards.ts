import { 
  Calendar, 
  User, 
  Settings, 
  FileText, 
  Code, 
  BarChart3,
  Building,
  Users,
  Briefcase
} from 'lucide-react';
import { USER_ROLES, type UserRole } from './roles';

export interface ActionCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string; // locale olmadan path
  colorClasses: string;
  roles: UserRole[];
}

export const ACTION_CARDS: ActionCard[] = [
  {
    title: 'Profilim',
    description: 'Hesap bilgilerinizi yönetin',
    icon: User,
    path: '/profile',
    colorClasses: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  {
    title: 'Ayarlar',
    description: 'Sistem ayarlarınızı düzenleyin',
    icon: Settings,
    path: '/settings',
    colorClasses: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  {
    title: 'Mülakatlarım',
    description: 'Mülakat geçmişinizi görüntüleyin',
    icon: Calendar,
    path: '/my-interviews',
    colorClasses: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
    roles: [USER_ROLES.CANDIDATE],
  },
  {
    title: 'Adaylar',
    description: 'Aday yönetimi ve listesi',
    icon: Users,
    path: '/candidates',
    colorClasses: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    title: 'Mülakatlar',
    description: 'Mülakat planlama ve yönetimi',
    icon: Calendar,
    path: '/interviews',
    colorClasses: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    title: 'İş İlanları',
    description: 'İlan oluşturun ve adayları yönetin',
    icon: Briefcase,
    path: '/job-postings',
    colorClasses: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    title: 'Kod Değerlendirme',
    description: 'Kod analizi ve puanlama',
    icon: Code,
    path: '/code-review',
    colorClasses: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    title: 'Firmalar',
    description: 'Firma yönetimi',
    icon: Building,
    path: '/companies',
    colorClasses: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300',
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    title: 'Analitik',
    description: 'İstatistikler ve raporlar',
    icon: BarChart3,
    path: '/analytics',
    colorClasses: 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300',
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
];

export const getActionCardsByRole = (role: UserRole): ActionCard[] => {
  return ACTION_CARDS.filter(card => card.roles.includes(role));
};
