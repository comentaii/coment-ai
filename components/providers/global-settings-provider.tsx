'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/use-redux';
import { setLanguage } from '@/store/features/globalSettingsSlice';

interface GlobalSettingsProviderProps {
  children: React.ReactNode;
}

export function GlobalSettingsProvider({ children }: GlobalSettingsProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize language from localStorage or default
    const savedLanguage = (localStorage.getItem('language') as 'tr' | 'en') || 'tr';
    
    // Set initial state
    dispatch(setLanguage(savedLanguage));
  }, [dispatch]);

  return <>{children}</>;
} 