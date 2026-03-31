import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from 'expo-router';
import LoadingScreen from './loading_screen';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/core';
import { useThemeStore } from '@/store/themeStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const queryClient = new QueryClient();
  const { isDarkMode } = useThemeStore();

  const currentTheme = isDarkMode ? 'dark' : 'light';
  const theme = Colors[currentTheme];

  const NavigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: Colors[currentTheme].background,
      card: Colors[currentTheme].background,
      text: Colors[currentTheme].text,
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
      <QueryClientProvider client={queryClient}>
        <RootSiblingParent>
          <ThemeProvider value={NavigationTheme}>
            <Stack
              screenOptions={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: theme.background,
                },
                headerTintColor: theme.text,
                headerShadowVisible: false,
              }}>
              <Stack.Screen name="(home)" options={{ headerShown: false }} />

              <Stack.Screen
                name="category/[id]"
                options={{
                  headerBackTitle: 'Back',
                }}
              />
            </Stack>
          </ThemeProvider>
        </RootSiblingParent>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
