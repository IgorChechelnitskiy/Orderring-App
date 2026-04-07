import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Link, Stack, useRouter} from 'expo-router';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useThemeStore} from '@/store/themeStore';
import {Colors} from '@/constants/theme';
import {Ionicons} from '@expo/vector-icons';

import {useAuth, useClerk, useSignUp} from '@clerk/expo';

export default function Page() {
  const { signUp, fetchStatus } = useSignUp();
  const { setActive } = useClerk();
  const clerk = useClerk();
  const { isLoaded } = useAuth();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { isDarkMode } = useThemeStore();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [emailAddress, setEmailAddress] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [username, setUsername] = React.useState('');

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
      username,
    });

    if (error) {
      console.error('Sign up error:', JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === 'complete') {
      console.log('Sign-up complete! Setting session active...');

      await setActive({ session: signUp.createdSessionId });

      router.replace('/(home)');
      return;
    }

    if (signUp.unverifiedFields.includes('email_address')) {
      console.log('Email verification required. Sending code...');
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    try {
      await (signUp as any).attemptEmailAddressVerification({
        code,
      });

      if (signUp.status === 'complete') {
        await clerk.setActive({ session: signUp.createdSessionId });
        router.replace('/(home)');
      }
    } catch (err: any) {
      console.error('Verification failed:', err);
      alert('Invalid code. Please try again.');
    }
  };

  console.log('--- CLERK STATE CHECK ---');
  console.log('Status:', signUp?.status);
  console.log('Unverified:', signUp?.unverifiedFields);
  console.log('Missing:', signUp?.missingFields);
  console.log('Fetch Status:', fetchStatus);

  if (isSignedIn || signUp.status === 'complete') {
    return null;
  }

  if (signUp.unverifiedFields.includes('email_address')) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <ThemedText type="title" style={styles.title}>
          Verify your email
        </ThemedText>

        <ThemedText style={styles.label}>Enter the 6-digit code sent to {emailAddress}</ThemedText>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: theme.text,
            },
          ]}
          value={code}
          placeholder="000000"
          placeholderTextColor={isDarkMode ? '#52616B' : '#9BA3A7'}
          onChangeText={setCode}
          keyboardType="numeric"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.tint },
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}>
          <ThemedText style={[styles.buttonText, { color: isDarkMode ? '#0F2027' : '#FFF' }]}>
            Verify Account
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => router.replace('/sign-up')} style={styles.secondaryButton}>
          <ThemedText style={{ color: theme.link, fontWeight: '700' }}>Back to Sign Up</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <ThemedView style={styles.container}>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
            />
            <ThemedText type="title" style={styles.title}>
              Sign up
            </ThemedText>

            <ThemedText style={styles.label}>User name</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: theme.text,
                },
              ]}
              placeholderTextColor={isDarkMode ? '#52616B' : '#9BA3A7'}
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              placeholder="Choose a username"
              onChangeText={(text) => setUsername(text)}
              keyboardType="default"
              returnKeyType="next"
            />
            <ThemedText style={styles.label}>Email address</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: theme.text,
                },
              ]}
              placeholderTextColor={isDarkMode ? '#52616B' : '#9BA3A7'}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              keyboardType="email-address"
            />
            <ThemedText style={styles.label}>Password</ThemedText>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
              ]}>
              <TextInput
                style={[styles.flexInput, { color: theme.text }]}
                placeholderTextColor={isDarkMode ? '#52616B' : '#9BA3A7'}
                value={password}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={isDarkMode ? '#9BA3A7' : '#52616B'}
                />
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.tint }, // Use Mint/Teal Tint
                fetchStatus === 'fetching' && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              disabled={fetchStatus === 'fetching'}>
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: isDarkMode ? '#0F2027' : '#FFFFFF' }, // Contrast check
                ]}>
                {fetchStatus === 'fetching' ? 'Processing...' : 'Continue'}
              </ThemedText>
            </Pressable>
            <View style={styles.linkContainer}>
              <ThemedText>Already have an account? </ThemedText>
              <Link href="/sign-in">
                <ThemedText style={{ color: theme.link, fontWeight: '700' }}>Sign in</ThemedText>
              </Link>
            </View>
            <View nativeID="clerk-captcha" />
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -1,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: -8,
    opacity: 0.8,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: -4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  flexInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 56,
  },
});
