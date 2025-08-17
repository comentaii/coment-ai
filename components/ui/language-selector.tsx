'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { setLanguage, toggleLanguageSelector, Language } from '@/store/features/globalSettingsSlice';

const languages = [
  { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

export function LanguageSelector() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { language, isLanguageSelectorOpen } = useAppSelector((state) => state.globalSettings);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLocale: Language) => {
    dispatch(setLanguage(newLocale));
    
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/tr`, '').replace(`/en`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const handleToggle = () => {
    dispatch(toggleLanguageSelector());
  };

  return (
    <DropdownMenu open={isLanguageSelectorOpen} onOpenChange={handleToggle}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Globe className="h-5 w-5 text-gray-700 dark:text-gray-200 hover:text-brand-green dark:hover:text-green-400 transition-colors duration-200" />
          <span className="sr-only">Dil seçimi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        {languages.map((languageOption) => (
          <DropdownMenuItem
            key={languageOption.code}
            onClick={() => handleLanguageChange(languageOption.code)}
            className={`transition-all duration-200 ${
              language === languageOption.code 
                ? 'bg-brand-green text-white dark:bg-green-500' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="mr-2 text-lg">{languageOption.flag}</span>
            <span className="text-base font-medium">{languageOption.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 