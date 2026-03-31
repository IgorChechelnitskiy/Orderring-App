/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore'; // Импортируем твой новый стор

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  // Вместо системного хука берем состояние из Zustand
  const { isDarkMode } = useThemeStore();

  // Определяем активную тему на основе стора
  const theme = isDarkMode ? 'dark' : 'light';

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
