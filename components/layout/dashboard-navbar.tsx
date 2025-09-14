'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserRoleBadge } from '@/components/user-role-badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/navigation';
import { USER_ROLES, type UserRole } from '@/lib/constants/roles';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';

export function DashboardNavbar() {
  const { session, logout } = useAuth();
  const t = useTranslations('Navigation');
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 px-4 lg:px-6 py-3 w-full h-16 flex items-center justify-between">
      {/* Left Side - Page Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="hidden sm:flex items-center">
          <LanguageSelector />
        </div>
        
        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        
        {/* User Menu */}
        <div className="flex items-center ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="bg-brand-green text-white dark:bg-green-500 dark:text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none text-gray-900 dark:text-gray-100">
                    {user?.name || 'Kullanıcı'}
                  </p>
                  <p className="text-sm leading-none text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <div className="mt-2">
                    <UserRoleBadge role={user?.roles?.[0] as UserRole || USER_ROLES.CANDIDATE} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={'/profile'}
                  className="text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>👤</span>
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={'/settings'}
                  className="text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>⚙️</span>
                  Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
} 