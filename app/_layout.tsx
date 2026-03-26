import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';
import LoadingScreen from './loading_screen';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/core';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const colorScheme = useColorScheme();

  // Создаем кастомную тему на основе твоих Colors
  const CustomTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: Colors[colorScheme ?? 'light'].background, // Твой Deep Forest или Ice White
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={CustomTheme}>
        <Slot />
      </ThemeProvider>
    </ClerkProvider>
  );
}
