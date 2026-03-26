/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#203A43'; // Deep Forest Main Teal
const tintColorDark = '#A8E6CF'; // Minty Green for Dark Mode visibility

export const Colors = {
  light: {
    text: '#0F2027', // Darkest Forest for text
    background: '#F0F4F5', // Ice White/Soft Blue background
    tint: tintColorLight,
    tabIconDefault: '#9BA3A7',
    tabIconSelected: tintColorLight,
    icon: '#687076',
  },
  dark: {
    text: '#D1F2EB', // Off-white for readability
    background: '#0F2027', // Deep Forest Base
    tint: tintColorDark, // Minty highlight
    tabIconDefault: '#52616B', // Subdued slate
    tabIconSelected: tintColorDark,
    icon: '#9BA1A6',
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
