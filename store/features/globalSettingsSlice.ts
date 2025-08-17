import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'tr' | 'en';
export type Theme = 'light' | 'dark' | 'system';

interface GlobalSettingsState {
  language: Language;
  theme: Theme;
  isLanguageSelectorOpen: boolean;
  isThemeToggleOpen: boolean;
}

const initialState: GlobalSettingsState = {
  language: 'tr',
  theme: 'light',
  isLanguageSelectorOpen: false,
  isThemeToggleOpen: false,
};

const globalSettingsSlice = createSlice({
  name: 'globalSettings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    setLanguageSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.isLanguageSelectorOpen = action.payload;
    },
    setThemeToggleOpen: (state, action: PayloadAction<boolean>) => {
      state.isThemeToggleOpen = action.payload;
    },
    toggleLanguageSelector: (state) => {
      state.isLanguageSelectorOpen = !state.isLanguageSelectorOpen;
    },
    toggleThemeToggle: (state) => {
      state.isThemeToggleOpen = !state.isThemeToggleOpen;
    },
  },
});

export const {
  setLanguage,
  setTheme,
  setLanguageSelectorOpen,
  setThemeToggleOpen,
  toggleLanguageSelector,
  toggleThemeToggle,
} = globalSettingsSlice.actions;

export default globalSettingsSlice.reducer; 