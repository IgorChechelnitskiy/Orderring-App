import { useClerk, useUser } from '@clerk/expo';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ImageSlider from '@/components/ImageSlider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const data = [
  {
    id: 1,
    title: 'First Item',
    image: require('../../assets/images/banners/philipp-dusel-bwJppMpcZd8-unsplash.jpg'),
  },
  {
    id: 2,
    title: 'Second Item',
    image: require('../../assets/images/banners/g-marujo-ym1-aEUfYg0-unsplash.jpg'),
  },
  {
    id: 3,
    title: 'Third Item',
    image: require('../../assets/images/banners/eugenia-pan-kiv-0mHR_XG_IEg-unsplash.jpg'),
  },
  {
    id: 4,
    title: 'Fourth Item',
    image: require('../../assets/images/banners/pjh-gSsnb0h0sr4-unsplash.jpg'),
  },
];

export default function Page() {
  const insets = useSafeAreaInsets();

  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // После выхода Clerk сбросит состояние, и _layout сам сделает редирект
  };

  return (
    // <ThemedView style={styles.container}>
    //   <ThemedText type="title">Welcome!</ThemedText>
    //
    //   <ThemedText style={styles.email}>Hello, {user?.emailAddresses[0].emailAddress}</ThemedText>
    //
    //   <Pressable style={styles.button} onPress={handleSignOut}>
    //     <ThemedText style={styles.buttonText}>Sign out</ThemedText>
    //   </Pressable>
    // </ThemedView>
    <ThemedView
      style={[
        styles.container,
        {
          // Apply padding dynamically based on the device's specific notch/top bar height
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <ImageSlider data={data} />
      <ThemedText style={styles.title}>Tab One Hello!!!</ThemedText>
      <ThemedView style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
