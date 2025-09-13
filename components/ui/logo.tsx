'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * Logo boyutu - 'sm', 'md', 'lg', 'xl', '2xl'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Sadece ikon göster (sidebar collapse durumu için)
   */
  iconOnly?: boolean;
  /**
   * Ek CSS sınıfları
   */
  className?: string;
  /**
   * Alt text
   */
  alt?: string;
  /**
   * Logo tıklanabilir mi?
   */
  clickable?: boolean;
  /**
   * Tıklama handler'ı
   */
  onClick?: () => void;
}

const sizeClasses = {
  sm: {
    container: 'h-10',
    icon: 'h-8 w-8',
    text: 'text-lg',
  },
  md: {
    container: 'h-12',
    icon: 'h-10 w-10',
    text: 'text-xl',
  },
  lg: {
    container: 'h-16',
    icon: 'h-14 w-14',
    text: 'text-2xl',
  },
  xl: {
    container: 'h-20',
    icon: 'h-18 w-18',
    text: 'text-4xl',
  },
  '2xl': {
    container: 'h-24',
    icon: 'h-22 w-22',
    text: 'text-5xl',
  },
};

export function Logo({ 
  size = 'md', 
  iconOnly = false, 
  className,
  alt = 'CodileAI Logo',
  clickable = false,
  onClick
}: LogoProps) {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tema değişikliklerini doğru algılamak için
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeConfig = sizeClasses[size];
  
  // Mount edilmeden önce light tema varsayılan
  if (!mounted) {
    return (
      <div className={cn('flex items-center gap-3', sizeConfig.container, className)}>
        <div className={cn('bg-gray-200 animate-pulse rounded', sizeConfig.icon)} />
      </div>
    );
  }

  const currentTheme = resolvedTheme || theme || systemTheme || 'light';
  const isDark = currentTheme === 'dark';

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  if (iconOnly) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center',
          sizeConfig.container,
          clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={handleClick}
      >
        <Image
          src="/logo-icon.png"
          alt={alt}
          width={48}
          height={48}
          className={cn('object-contain', sizeConfig.icon)}
          priority
        />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'flex items-center gap-3 relative',
        sizeConfig.container,
        clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={handleClick}
    >
      {/* Light tema logo - CSS ile gizle/göster */}
      <Image
        src="/logo-light.png"
        alt={alt}
        width={200}
        height={60}
        className={cn(
          'object-contain transition-opacity duration-300 dark:hidden',
          sizeConfig.icon
        )}
        priority
      />
      {/* Dark tema logo - CSS ile gizle/göster */}
      <Image
        src="/logo-dark.png"
        alt={alt}
        width={200}
        height={60}
        className={cn(
          'object-contain transition-opacity duration-300 hidden dark:block',
          sizeConfig.icon
        )}
        priority
      />
    </div>
  );
}

/**
 * Sidebar için özel logo bileşeni
 * Collapse durumunda sadece ikon gösterir
 */
interface SidebarLogoProps {
  isCollapsed: boolean;
  className?: string;
  onClick?: () => void;
}

export function SidebarLogo({ isCollapsed, className, onClick }: SidebarLogoProps) {
  return (
    <Logo
      iconOnly={isCollapsed}
      size={isCollapsed ? 'md' : 'lg'}
      className={className}
      clickable={!!onClick}
      onClick={onClick}
    />
  );
}
