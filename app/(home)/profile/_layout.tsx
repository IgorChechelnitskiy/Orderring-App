import { router, Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function ProfileLayout() {
  const { theme } = useThemeStore();
  const activeColors = Colors[theme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        headerTintColor: activeColors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerBackTitle: '',
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="userConfiguration"
        options={{
          title: 'Settings',
          headerTitle: () => (
            <Pressable
              onPress={() => router.push('/profile')}
              style={{ width: '100%', paddingVertical: 10 }}>
              <ThemedText type="subtitle">Settings</ThemedText>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="changeName"
        options={{
          title: 'Change Name',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: 'Change Password',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
