import Toast from 'react-native-root-toast';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

export type ToastType = 'success' | 'danger' | 'info';

export const useAppToast = () => {
  const { theme, isDarkMode } = useThemeStore();
  const activeColors = Colors[theme];

  const showToast = (message: string, type: ToastType = 'info') => {
    const getStyles = () => {
      switch (type) {
        case 'success':
          return {
            bg: isDarkMode ? '#1B4332' : '#D8F3DC',
            text: isDarkMode ? '#95D5B2' : '#1B4332',
          };
        case 'danger':
          return {
            bg: isDarkMode ? '#441010' : '#FFD6D6',
            text: isDarkMode ? '#FF8787' : '#8A0000',
          };
        case 'info':
        default:
          return {
            bg: isDarkMode ? '#1A212E' : '#FFFFFF',
            text: activeColors.text,
          };
      }
    };

    const { bg, text } = getStyles();

    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM - 20,
      shadow: false,
      animation: true,
      hideOnPress: true,
      backgroundColor: bg,
      textColor: text,
      opacity: 1,
      containerStyle: {
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: '90%',
        borderWidth: 1,
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      },
      textStyle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
      },
    });
  };

  return { showToast };
};
