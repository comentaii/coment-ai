import { 
  Home, 
  Users, 
  Building, 
  FileText, 
  Calendar, 
  Settings, 
  BarChart3, 
  Code, 
  UserCheck,
  Briefcase,
  Terminal,
  ShieldCheck
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
    roles: [USER_ROLES.HR_MANAGER], // SUPER_ADMIN will see it via its own section
  },
  // {
  //   id: 'companies',
  //   label: 'Firmalar',
  //   description: 'Firma yönetimi',
  //   path: '/companies',
  //   icon: Building,
  //   roles: [USER_ROLES.SUPER_ADMIN],
  // },
  {
    id: 'interviews',
    label: 'Mülakatlar',
    description: 'Mülakat planlama ve yönetimi',
    path: '/interviews',
    icon: Calendar,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER],
  },
  {
    id: 'job-postings',
    label: 'İş İlanları',
    description: 'İlan oluştur ve adayları yönet',
    path: '/job-postings',
    icon: Briefcase,
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
    id: 'interview-screen',
    label: 'Kodlama Mülakat',
    description: 'AI destekli kodlama mülakat ekranı',
    path: '/interview-screen',
    icon: Terminal,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
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
    roles: [USER_ROLES.HR_MANAGER, USER_ROLES.TECHNICAL_INTERVIEWER, USER_ROLES.CANDIDATE],
  },
  // Super Admin Section
  {
    id: 'super-admin-dashboard',
    label: 'Süper Admin',
    description: 'Platform yönetimi paneli',
    path: '/super-admin',
    icon: ShieldCheck,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    id: 'super-admin-companies',
    label: 'Şirket Yönetimi',
    description: 'Şirketleri ve abonelikleri yönet',
    path: '/super-admin/companies',
    icon: Building,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    id: 'super-admin-users',
    label: 'Kullanıcı Yönetimi',
    description: 'Tüm kullanıcıları yönet',
    path: '/super-admin/users',
    icon: Users,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
  {
    id: 'super-admin-settings',
    label: 'Platform Ayarları',
    description: 'Genel sistem ayarları',
    path: '/super-admin/settings',
    icon: Settings,
    roles: [USER_ROLES.SUPER_ADMIN],
  },
];

/**
 * Filters navigation items based on the user's roles.
 * A user will see an item if they have at least one of the roles required for that item.
 * @param {UserRole[]} roles - The array of roles the user has.
 * @returns {NavigationItem[]} The filtered list of navigation items.
 */
export const getNavigationItemsByRoles = (roles: UserRole[]): NavigationItem[] => {
  if (!roles || roles.length === 0) {
    // Default to candidate navigation if no roles are provided
    return NAVIGATION_ITEMS.filter(item => item.roles.includes(USER_ROLES.CANDIDATE));
  }
  
  // Use a Set to avoid duplicate navigation items if a user has multiple roles
  // that can see the same item.
  const accessibleNavItems = new Set<NavigationItem>();

  NAVIGATION_ITEMS.forEach(item => {
    // An item is accessible if the user has at least one of the required roles for it.
    if (item.roles.some(requiredRole => roles.includes(requiredRole))) {
      accessibleNavItems.add(item);
    }
  });

  return Array.from(accessibleNavItems);
};
