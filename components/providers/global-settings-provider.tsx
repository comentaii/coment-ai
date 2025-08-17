'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/use-redux';
import { setLanguage, setTheme } from '@/store/features/globalSettingsSlice';

interface GlobalSettingsProviderProps {
  children: React.ReactNode;
}

export function GlobalSettingsProvider({ children }: GlobalSettingsProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'light';
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' || 'tr';
    
    // Set initial state
    dispatch(setTheme(savedTheme));
    dispatch(setLanguage(savedLanguage));

    // Apply theme immediately
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (savedTheme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [dispatch]);

  return <>{children}</>;
} 