import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { useAppToast } from '@/hooks/use-app-toast';

export default function ChangePasswordScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { showToast } = useAppToast();
  const { theme, isDarkMode } = useThemeStore();
  const activeColors = Colors[theme];

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    Keyboard.dismiss();

    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'danger');
      return;
    }

    try {
      setLoading(true);
      await user?.updatePassword({
        newPassword: password,
      });

      showToast('Password updated successfully!', 'success');
      router.back();
    } catch (err: any) {
      showToast(err.errors?.[0]?.message || 'Failed to update password', 'danger');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.label}>New Password</ThemedText>

        <View
          style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#2e5049' : '#E5E9EB' }]}>
          <TextInput
            style={[styles.input, { color: activeColors.text }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            placeholderTextColor="#8E8E93"
            secureTextEntry={!showPassword}
            autoFocus
          />
          {password.length > 0 && (
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8E8E93" />
            </Pressable>
          )}
        </View>

        <ThemedText style={styles.label}>Confirm Password</ThemedText>

        <View
          style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#2e5049' : '#E5E9EB' }]}>
          <TextInput
            style={[styles.input, { color: activeColors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat new password"
            placeholderTextColor="#8E8E93"
            secureTextEntry={!showConfirmPassword}
          />
          {confirmPassword.length > 0 && (
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconButton}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8E8E93" />
            </Pressable>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: activeColors.tint },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={isDarkMode ? '#FFFFFF' : '#0F2027'} />
            ) : (
              <ThemedText style={styles.saveText}>Update</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 20 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  saveButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelText: { fontWeight: '600', fontSize: 16 },
  saveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
