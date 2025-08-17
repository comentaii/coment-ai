'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { setTheme, toggleThemeToggle, Theme } from '@/store/features/globalSettingsSlice';
import { useEffect } from 'react';

const themes = [
  { value: 'light' as Theme, label: 'Açık', icon: Sun },
  { value: 'dark' as Theme, label: 'Koyu', icon: Moon },
  { value: 'system' as Theme, label: 'Sistem', icon: Sun },
];

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const { theme, isThemeToggleOpen } = useAppSelector((state) => state.globalSettings);

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  const handleToggle = () => {
    dispatch(toggleThemeToggle());
  };

  return (
    <DropdownMenu open={isThemeToggleOpen} onOpenChange={handleToggle}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-200 hover:text-brand-green dark:hover:text-green-400" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-200 hover:text-brand-green dark:hover:text-green-400" />
          <span className="sr-only">Tema değiştir</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              className={`transition-all duration-200 ${
                theme === themeOption.value 
                  ? 'bg-brand-green text-white dark:bg-green-500' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="font-medium">{themeOption.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
