import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSignIn } from '@clerk/expo';
import { type Href, Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const { isDarkMode } = useThemeStore();
  const theme = Colors[isDarkMode ? 'dark' : 'light'];

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      identifier: emailAddress,
      password,
    });

    if (error) {
      alert(error.message);
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: async ({ session }) => {
          if (session?.currentTask) {
            console.log('Pending task:', session?.currentTask);
            return;
          }

          console.log('Sign in complete! Redirecting...');
          router.replace('/(home)');
        },
      });
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error('Sign-in status:', signIn.status);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  if (signIn.status === 'needs_client_trust') {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ThemedText type="title" style={[styles.title, { fontSize: 24, fontWeight: 'bold' }]}>
          Verify your account
        </ThemedText>
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
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <ThemedText style={styles.error}>{errors.fields.code.message}</ThemedText>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}>
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.mfa.sendEmailCode()}>
          <ThemedText style={styles.secondaryButtonText}>I need a new code</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.reset()}>
          <ThemedText style={styles.secondaryButtonText}>Start over</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ThemedText type="title" style={styles.title}>
        Sign in
      </ThemedText>

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
      {errors.fields.identifier && (
        <ThemedText style={styles.error}>{errors.fields.identifier.message}</ThemedText>
      )}
      <ThemedText style={styles.label}>Password</ThemedText>
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
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.fields.password && (
        <ThemedText style={styles.error}>{errors.fields.password.message}</ThemedText>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.tint },
          fetchStatus === 'fetching' && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={fetchStatus === 'fetching'}>
        <ThemedText style={[styles.buttonText, { color: isDarkMode ? '#0F2027' : '#FFFFFF' }]}>
          {fetchStatus === 'fetching' ? 'Processing...' : 'Continue'}
        </ThemedText>
      </Pressable>

      <View style={styles.linkContainer}>
        <ThemedText>Don&#39;t have an account? </ThemedText>
        <Link href="/sign-up">
          <ThemedText style={{ color: theme.link, fontWeight: '700' }}>Sign up</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center', // Centers the form for a pro look
    gap: 16,
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    // Colors will be applied inline via theme store
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    color: '#0F2027', // Dark text on the light mint button
    fontWeight: '800',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
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
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
