import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation';
 
export const locales = ['en', 'tr'] as const;
export const localePrefix = 'always';
 
export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/profile': '/profile',
  '/settings': '/settings',
  '/auth/signin': '/auth/signin',
  '/auth/signup': '/auth/signup',
} satisfies Pathnames<typeof locales>;
 
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    pathnames
  });
