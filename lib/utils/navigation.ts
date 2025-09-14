import { useParams } from 'next/navigation';
import { NAVIGATION_ITEMS, type NavigationItem } from '@/lib/constants/navigation';
import { type UserRole } from '@/lib/constants/roles';

export const useNavigation = () => {
  const params = useParams();
  const locale = params.locale as string;

  const getLocalizedPath = (path: string): string => {
    return `/${locale}${path}`;
  };

  const getNavigationItemsByRole = (role: UserRole): NavigationItem[] => {
    return NAVIGATION_ITEMS.filter(item => item.roles.includes(role));
  };

  const getNavigationItemsByRoles = (roles: UserRole[]): NavigationItem[] => {
    return NAVIGATION_ITEMS.filter(item => 
      item.roles.some(role => roles.includes(role))
    );
  };

  const getCurrentPath = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  };

  const isActivePath = (itemPath: string): boolean => {
    const currentPath = getCurrentPath();
    const localizedItemPath = getLocalizedPath(itemPath);
    return currentPath === localizedItemPath;
  };

  return {
    locale,
    getLocalizedPath,
    getNavigationItemsByRole,
    getNavigationItemsByRoles,
    getCurrentPath,
    isActivePath,
  };
};
