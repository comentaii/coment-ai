'use client';

import { signOut } from 'next-auth/react';
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

export function DashboardNavbar() {
  const { session } = useAuth();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };
  
  if (!session) {
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
                    src={session.user?.image || ""}
                    alt={session.user?.name || ""}
                  />
                  <AvatarFallback className="bg-brand-green text-white dark:bg-green-500 dark:text-white text-sm font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none text-gray-900 dark:text-gray-100">
                    {session.user?.name || 'Kullanıcı'}
                  </p>
                  <p className="text-sm leading-none text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </p>
                  <div className="mt-2">
                    <UserRoleBadge role={session.user?.role as UserRole || USER_ROLES.CANDIDATE} />
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
              <DropdownMenuItem asChild className="p-0">
                <button
                  onClick={handleLogout}
                  className="w-full h-full text-left text-sm cursor-pointer text-red-600 dark:text-red-400 flex items-center gap-2 px-2 py-1.5 rounded-sm focus:bg-red-50 dark:focus:bg-red-900/20 outline-none"
                >
                  <span>🚪</span>
                  Çıkış Yap
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
} 