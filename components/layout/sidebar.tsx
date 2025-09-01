'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Users,
  Building,
  Calendar,
  FileText,
  Code,
  UserCheck,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useNavigation } from '@/lib/utils/navigation';
import { USER_ROLES, type UserRole } from '@/lib/constants/roles';

interface MenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { session } = useAuth();
  const { locale, getLocalizedPath, getNavigationItemsByRole, isActivePath } = useNavigation();

  const userRole = (session?.user?.role as UserRole) || USER_ROLES.CANDIDATE;
  const filteredMenuItems = getNavigationItemsByRole(userRole);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const MenuItemComponent = ({ item, isCollapsed, onClick }: {
    item: any;
    isCollapsed: boolean;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const isActive = isActivePath(item.path);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick();
      }
    };

    return (
      <Link
        href={getLocalizedPath(item.path)}
        onClick={onClick ? handleLinkClick : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200",
          isActive
            ? "bg-brand-green text-white shadow-sm"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center flex-shrink-0 transition-all duration-200",
          isCollapsed ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Icon className={cn(
            "transition-all duration-200",
            isCollapsed ? "h-5 w-5" : "h-6 w-6",
            isActive
              ? "text-white"
              : "text-brand-green dark:text-green-400 group-hover:text-brand-green dark:group-hover:text-green-400"
          )} />
        </div>

        {/* Text Content */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0 space-y-1">
            <p className={cn(
              "font-medium leading-none transition-colors duration-200",
              isActive ? "text-white" : "text-gray-900 dark:text-gray-100"
            )}>
              {item.label}
            </p>
            <p className={cn(
              "text-xs leading-none transition-colors duration-200",
              isActive
                ? "text-green-100"
                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            )}>
              {item.description}
            </p>
          </div>
        )}

        {/* Active Indicator */}
        {isActive && !isCollapsed && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out h-full fixed left-0 top-0 z-30 shadow-lg",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Logo and Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 h-16">
          <Link
            href={getLocalizedPath('/dashboard')}
            className={cn(
              "text-xl font-bold text-brand-green dark:text-green-400 transition-all duration-200",
              isCollapsed && "text-center block"
            )}
          >
            {isCollapsed ? "CA" : "Coment-AI"}
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* User Info Section */}
        {!isCollapsed && session?.user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session.user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {session.user.name || 'Kullanıcı'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.role || 'candidate'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out shadow-xl",
        isMobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <Link href={getLocalizedPath('/dashboard')} className="text-xl font-bold text-brand-green dark:text-green-400">
              Coment-AI
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileSidebar}
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                isCollapsed={false}
                onClick={closeMobileSidebar}
              />
            ))}
          </nav>

          {/* Mobile User Info */}
          {session?.user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {session.user.name || 'Kullanıcı'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user.role || 'candidate'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Spacer for Desktop */}
      <div className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )} />
    </>
  );
} 