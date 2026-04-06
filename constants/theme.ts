import { Platform } from 'react-native';

const tintColorLight = '#203A43';
const tintColorDark = '#A8E6CF';

export const Colors = {
  light: {
    text: '#0F2027',
    background: '#F0F4F5',
    tint: tintColorLight,
    tabIconDefault: '#9BA3A7',
    tabIconSelected: tintColorLight,
    icon: '#687076',
    buttonBackground: '#E5E9EB',
    link: '#2C5E6E',
  },
  dark: {
    text: '#D1F2EB',
    background: '#0F2027',
    tint: tintColorDark,
    tabIconDefault: '#52616B',
    tabIconSelected: tintColorDark,
    buttonBackground: '#2C3545',
    icon: '#9BA1A6',
    link: '#76D7C4',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
