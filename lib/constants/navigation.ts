import { 
  Home, 
  Users, 
  Building, 
  FileText, 
  Calendar, 
  Settings, 
  BarChart3, 
  Code, 
  UserCheck 
} from 'lucide-react';
import { USER_ROLES, type UserRole } from './roles';

export interface NavigationItem {
  id: string;
  label: string;
  description: string;
  path: string; // locale olmadan path
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Ana kontrol paneli',
    path: '/dashboard',
    icon: Home,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  {
    id: 'candidates',
    label: 'Adaylar',
    description: 'Aday yönetimi ve listesi',
    path: '/candidates',
    icon: Users,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    id: 'companies',
    label: 'Firmalar',
    description: 'Firma yönetimi',
    path: '/companies',
    icon: Building,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    id: 'interviews',
    label: 'Mülakatlar',
    description: 'Mülakat planlama ve yönetimi',
    path: '/interviews',
    icon: Calendar,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    id: 'cv-analysis',
    label: 'CV Analizi',
    description: 'CV değerlendirme ve analiz',
    path: '/cv-analysis',
    icon: FileText,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER],
  },
  {
    id: 'code-review',
    label: 'Kod Değerlendirme',
    description: 'Kod analizi ve puanlama',
    path: '/code-review',
    icon: Code,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    id: 'my-interviews',
    label: 'Mülakatlarım',
    description: 'Kişisel mülakat geçmişi',
    path: '/my-interviews',
    icon: UserCheck,
    roles: [USER_ROLES.CANDIDATE],
  },
  {
    id: 'analytics',
    label: 'Analitik',
    description: 'İstatistikler ve raporlar',
    path: '/analytics',
    icon: BarChart3,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    description: 'Hesap ve sistem ayarları',
    path: '/settings',
    icon: Settings,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
];

export const getNavigationItemsByRole = (role: UserRole): NavigationItem[] => {
  return NAVIGATION_ITEMS.filter(item => item.roles.includes(role));
};
