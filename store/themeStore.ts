import { create } from 'zustand';
import { Appearance } from 'react-native';

interface ThemeState {
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: Appearance.getColorScheme() === 'dark',
  theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',

  toggleTheme: () =>
    set((state) => {
      const nextIsDark = !state.isDarkMode;
      return {
        isDarkMode: nextIsDark,
        theme: nextIsDark ? 'dark' : 'light',
      };
    }),

  setTheme: (isDark) =>
    set({
      isDarkMode: isDark,
      theme: isDark ? 'dark' : 'light',
    }),
}));
