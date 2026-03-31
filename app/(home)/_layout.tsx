import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
// 1. Импортируем твой стор
import { useThemeStore } from '@/store/themeStore';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  // 2. Берем значение из нашего Zustand Store вместо useColorScheme
  const { isDarkMode } = useThemeStore();
  const colorScheme = isDarkMode ? 'dark' : 'light';
  const theme = Colors[colorScheme];

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: theme.background },
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 65,
          bottom: insets.bottom > 0 ? insets.bottom : 20,
          left: 16,
          right: 16,
          borderRadius: 32,
          backgroundColor: theme.background, // Фон таб-бара теперь реактивный
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingBottom: 0,
          borderWidth: isDarkMode ? 0 : 1,
          borderColor: 'rgba(0,0,0,0.05)',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Main',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      {/*<Tabs.Screen*/}
      {/*  name="profile/userConfiguration"*/}
      {/*  options={{*/}
      {/*    href: null,*/}
      {/*    headerShown: true,*/}
      {/*    title: 'User Settings',*/}
      {/*    headerTitle: () => (*/}
      {/*      <Pressable*/}
      {/*        onPress={() => router.push('/profile')}*/}
      {/*        style={{ width: '100%', paddingVertical: 10 }}>*/}
      {/*        <ThemedText type="subtitle">User Settings</ThemedText>*/}
      {/*      </Pressable>*/}
      {/*    ),*/}
      {/*    headerLeft: () => (*/}
      {/*      <Pressable onPress={() => router.push('/profile')} style={{ marginLeft: 15 }}>*/}
      {/*        <Ionicons name="chevron-back" size={24} color={theme.text} />*/}
      {/*      </Pressable>*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
    </Tabs>
  );
}
