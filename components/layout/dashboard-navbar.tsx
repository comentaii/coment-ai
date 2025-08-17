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
import Link from 'next/link';

export function DashboardNavbar() {
  const { session, logout } = useAuth();

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 px-4 py-4 w-full h-16 flex items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-end w-full">
        {/* Right Side Controls */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center">
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
                  className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback className="bg-brand-green text-white dark:bg-green-500 dark:text-white">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium leading-none text-brand-green dark:text-green-400">
                      {session.user?.name}
                    </p>
                    <p className="text-sm leading-none text-gray-600 dark:text-gray-400">
                      {session.user?.email}
                    </p>
                    <div className="mt-2">
                      <UserRoleBadge role={session.user?.role || "candidate"} />
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/tr/profile"
                    className="text-base cursor-pointer"
                  >
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/tr/settings"
                    className="text-base cursor-pointer"
                  >
                    Ayarlar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-base cursor-pointer text-custom-red dark:text-red-400"
                >
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
} 