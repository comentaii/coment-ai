'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Building,
  FileText,
  Calendar,
  Settings,
  BarChart3,
  Code,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Ana kontrol paneli',
    href: '/tr/dashboard',
    icon: Home,
    roles: ['super_admin', 'hr_manager', 'technical_interviewer', 'candidate'],
  },
  {
    id: 'candidates',
    label: 'Adaylar',
    description: 'Aday yönetimi ve listesi',
    href: '/tr/candidates',
    icon: Users,
    roles: ['super_admin', 'hr_manager'],
  },
  {
    id: 'companies',
    label: 'Firmalar',
    description: 'Firma yönetimi',
    href: '/tr/companies',
    icon: Building,
    roles: ['super_admin'],
  },
  {
    id: 'interviews',
    label: 'Mülakatlar',
    description: 'Mülakat planlama ve yönetimi',
    href: '/tr/interviews',
    icon: Calendar,
    roles: ['super_admin', 'hr_manager', 'technical_interviewer'],
  },
  {
    id: 'cv-analysis',
    label: 'CV Analizi',
    description: 'CV değerlendirme ve analiz',
    href: '/tr/cv-analysis',
    icon: FileText,
    roles: ['super_admin', 'hr_manager'],
  },
  {
    id: 'code-review',
    label: 'Kod Değerlendirme',
    description: 'Kod analizi ve puanlama',
    href: '/tr/code-review',
    icon: Code,
    roles: ['super_admin', 'technical_interviewer'],
  },
  {
    id: 'my-interviews',
    label: 'Mülakatlarım',
    description: 'Kişisel mülakat geçmişi',
    href: '/tr/my-interviews',
    icon: UserCheck,
    roles: ['candidate'],
  },
  {
    id: 'analytics',
    label: 'Analitik',
    description: 'İstatistikler ve raporlar',
    href: '/tr/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'hr_manager', 'technical_interviewer'],
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    description: 'Hesap ve sistem ayarları',
    href: '/tr/settings',
    icon: Settings,
    roles: ['super_admin', 'hr_manager', 'technical_interviewer', 'candidate'],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { session } = useAuth();
  const pathname = usePathname();

  const userRole = session?.user?.role || 'candidate';
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="bg-white dark:bg-brand-dark border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col bg-white dark:bg-brand-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out h-full fixed left-0 top-0 z-30",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo and Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
          <Link
            href="/tr/dashboard"
            className={cn(
              "text-2xl font-bold text-brand-green dark:text-green-400",
              isCollapsed && "text-center block"
            )}
          >
            {isCollapsed ? "CA" : "Coment-AI"}
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 group",
                  isActive 
                    ? "bg-brand-green text-white" 
                    : "text-brand-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-brand-green dark:text-green-400"
                )} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 z-50 h-full bg-white dark:bg-brand-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isMobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/tr/dashboard" className="text-xl font-bold text-brand-green dark:text-green-400">
              Coment-AI
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 group",
                    isActive 
                      ? "bg-brand-green text-white" 
                      : "text-brand-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-brand-green dark:text-green-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Spacer for Desktop */}
      <div className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )} />
    </>
  );
} 