import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'tr' | 'en';

interface GlobalSettingsState {
  language: Language;
  isLanguageSelectorOpen: boolean;
}

const initialState: GlobalSettingsState = {
  language: 'tr',
  isLanguageSelectorOpen: false,
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
    setLanguageSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.isLanguageSelectorOpen = action.payload;
    },
    toggleLanguageSelector: (state) => {
      state.isLanguageSelectorOpen = !state.isLanguageSelectorOpen;
    },
  },
});

export const {
  setLanguage,
  setLanguageSelectorOpen,
  toggleLanguageSelector,
} = globalSettingsSlice.actions;

export default globalSettingsSlice.reducer; 