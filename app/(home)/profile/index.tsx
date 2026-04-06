import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View
} from 'react-native';
import { useClerk, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const { isDarkMode, theme, toggleTheme } = useThemeStore();
  const activeColors = Colors[theme];
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);

  const MenuRow = ({
    icon,
    title,
    iconColor,
    bgColor,
    rightElement,
    onPressAction,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    iconColor: string;
    bgColor: string;
    rightElement?: React.ReactNode;
    onPressAction?: () => void;
  }) => (
    <Pressable style={styles.menuRow} onPress={onPressAction}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <ThemedText style={styles.menuTitle}>{title}</ThemedText>
      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{user?.fullName}</ThemedText>
              <ThemedText style={styles.joinedDate}>Member since 2024</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.sectionLabel}>Profile</ThemedText>
          <View style={styles.sectionCard}>
            <MenuRow
              icon="person-outline"
              title="Manage user"
              iconColor="#FF9500"
              bgColor={isDarkMode ? '#2C2010' : '#FFF9F2'}
              onPressAction={() => {
                router.push('/profile/userConfiguration');
              }}
            />
          </View>

          <ThemedText style={styles.sectionLabel}>Settings</ThemedText>
          <View style={styles.sectionCard}>
            <MenuRow
              icon="notifications-outline"
              title={`Notifications: ${isNotificationsOn ? 'On' : 'Off'}`}
              iconColor="#5856D6"
              bgColor={isDarkMode ? '#1C1C3A' : '#F2F2FF'}
              rightElement={
                <Switch
                  value={isNotificationsOn}
                  onValueChange={setIsNotificationsOn}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                />
              }
            />

            <View
              style={[styles.separator, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }]}
            />

            <MenuRow
              icon={isDarkMode ? 'moon' : 'sunny-outline'}
              title={isDarkMode ? 'Dark Mode' : 'Light Mode'}
              iconColor="#007AFF"
              bgColor={isDarkMode ? '#101E2C' : '#F2F9FF'}
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                />
              }
            />
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Pressable
            style={[styles.signOutButton, { backgroundColor: activeColors.buttonBackground }]}
            onPress={() => signOut()}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120,
    justifyContent: 'space-between',
  },
  mainContent: { width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  userInfo: { marginLeft: 20 },
  userName: { fontSize: 22, fontWeight: '700' },
  joinedDate: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: { marginBottom: 30 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 52, marginVertical: 4 },
  bottomContent: { marginTop: 20 },
  signOutButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  signOutText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
});
