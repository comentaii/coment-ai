"use client";

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


export function Navbar() {
  const { session } = useAuth();

  const handleLogout = () => {
    console.log("Çıkış yapma fonksiyonu tetiklendi!");
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white dark:bg-brand-dark border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-2xl font-bold text-brand-green dark:text-green-400"
          >
            CodileAI
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
                      <UserRoleBadge role={session.user?.roles?.[0] || "candidate"} />
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="text-base cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="text-base cursor-pointer"
                  >
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="text-base cursor-pointer"
                  >
                    Ayarlar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="p-0"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full h-full text-left text-base cursor-pointer text-red-500 dark:text-red-400 px-2 py-1.5 rounded-sm focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/50 dark:focus:text-red-400 outline-none"
                  >
                    Çıkış Yap
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
