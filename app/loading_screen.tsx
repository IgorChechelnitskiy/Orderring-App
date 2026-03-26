import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen = () =>
  <View style={styles.container}>
    <LinearGradient
      colors={['#0F2027', '#203A43', '#2c5364']}
      style={styles.background}
    />
    <Image source={require('../assets/images/order-icon.png')} style={{width: 100, height: 100}}/>
    <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
  </View>;
  export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});