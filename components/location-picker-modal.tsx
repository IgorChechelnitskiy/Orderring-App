import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

export function LocationPickerModal({ visible, onClose, onSelect }: any) {
  const [region, setRegion] = useState<any>(null);
  const [pickedLocation, setPickedLocation] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'We need location access to show where to deliver your food.',
          );
          onClose();
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const initialRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          setRegion(initialRegion);
          setPickedLocation(initialRegion);
        } catch (error) {
          Alert.alert('Error', 'Could not fetch your current location.');
          console.error(error);
        }
      })();
    }
  }, [visible, onClose]);

  const handleConfirm = async () => {
    if (pickedLocation) {
      const [address] = await Location.reverseGeocodeAsync(pickedLocation);
      const addressString = `${address.streetNumber || ''} ${address.street || ''}, ${address.city}`;
      onSelect({ ...pickedLocation, address: addressString });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {region && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            onPress={(e) => setPickedLocation(e.nativeEvent.coordinate)}>
            {pickedLocation && <Marker coordinate={pickedLocation} title="Deliver here" />}
          </MapView>
        )}

        <View style={styles.footer}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
            <ThemedText style={styles.confirmText}>Confirm Delivery Location</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: { position: 'absolute', bottom: 40, left: 20, right: 20, gap: 10 },
  confirmBtn: { backgroundColor: '#203A43', padding: 18, borderRadius: 16, alignItems: 'center' },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  closeBtn: {
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
});
