import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link, Stack, useSegments } from 'expo-router';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { FoodDashLogo } from '@/components/food-dash-logo';
import { ThemedText } from '@/components/themed-text';
import LoadingScreen from './loading_screen';
import { useSearchStore } from '@/store/searchStore';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 10, gcTime: 1000 * 60 * 30 },
  },
});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { query, setQuery } = useSearchStore();

  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { isDarkMode } = useThemeStore();
  const cartItems = useCartStore((state) => state.items);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const currentTheme = isDarkMode ? 'dark' : 'light';
  const theme = Colors[currentTheme];

  const isSubPage = segments[0] !== '(home)' && segments.length > 0;
  const isProfilePage = (segments as string[]).includes('profile');
  const isCategoryPage = (segments as string[]).includes('category');
  const isOrderPage = (segments as string[]).includes('order');
  const isDishPage = (segments as string[]).includes('dish');
  const shouldShowHeader = !isSubPage && !isProfilePage;

  const NavigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.background,
      text: theme.text,
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) return <LoadingScreen />;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <RootSiblingParent>
          <ThemeProvider value={NavigationTheme}>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.background,
              }}>
              {shouldShowHeader && (
                <View
                  style={[
                    styles.headerContainer,
                    {
                      backgroundColor: theme.background,
                      paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0),
                    },
                  ]}>
                  <View style={styles.headerTopRow}>
                    <Pressable
                      onPress={() => {
                        setIsSearchVisible(!isSearchVisible);
                        setQuery('');
                      }}
                      style={styles.iconButton}>
                      <Ionicons
                        name={isSearchVisible ? 'close' : 'search-outline'}
                        size={24}
                        color={theme.text}
                      />
                    </Pressable>

                    <View style={styles.logoCenterContainer} pointerEvents="box-none">
                      <FoodDashLogo />
                    </View>

                    <Link href="/cart" asChild>
                      <Pressable style={styles.iconButton}>
                        <Ionicons name="cart-outline" size={26} color={theme.text} />
                        {totalCount > 0 && (
                          <View style={[styles.badge, { borderColor: theme.background }]}>
                            <ThemedText style={styles.badgeText}>
                              {totalCount > 9 ? '9+' : totalCount}
                            </ThemedText>
                          </View>
                        )}
                      </Pressable>
                    </Link>
                  </View>

                  {isSearchVisible && (
                    <View style={styles.searchBarContainer}>
                      <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
                      <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search dishes..."
                        placeholderTextColor="#888"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                        returnKeyType="search"
                      />
                    </View>
                  )}
                </View>
              )}

              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(home)" />
                <Stack.Screen
                  name="category/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: '',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: theme.background },
                    headerTintColor: theme.text,
                  }}
                />
                <Stack.Screen
                  name="cart"
                  options={{
                    headerShown: true,
                    presentation: 'modal',
                    title: 'Your Cart',
                    headerStyle: { backgroundColor: theme.background },
                    headerTintColor: theme.text,
                  }}
                />
              </Stack>
            </View>
          </ThemeProvider>
        </RootSiblingParent>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 1000,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  logoCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#ff6347',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 14,
    includeFontPadding: false,
  },
});
