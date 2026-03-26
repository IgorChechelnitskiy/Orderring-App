import { useClerk, useUser } from '@clerk/expo';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome!</ThemedText>

      <ThemedText style={styles.email}>Hello, {user?.emailAddresses[0].emailAddress}</ThemedText>

      <Pressable style={styles.button} onPress={handleSignOut}>
        <ThemedText style={styles.buttonText}>Sign out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#d32f2f', // Сделаем кнопку выхода красной для контраста
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
