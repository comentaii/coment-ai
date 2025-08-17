"use client";

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

const roleLabels = {
  super_admin: 'Süper Admin',
  hr_manager: 'İK Yetkilisi',
  technical_interviewer: 'Teknik Mülakatçı',
  candidate: 'Aday',
};

export function Navbar() {
  const { session, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-brand-dark border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/tr"
            className="text-2xl font-bold text-brand-green dark:text-green-400"
          >
            Coment-AI
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback className="bg-brand-green text-white dark:bg-brand-green dark:text-white">
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
                    href="/tr/dashboard"
                    className="text-base cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
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
                  className="text-base cursor-pointer text-custom-red dark:text-custom-red"
                >
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/tr/auth/signin">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/tr/auth/signup">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
