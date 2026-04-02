import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';

export function FoodDashLogo() {
  return (
    <View style={styles.container}>
      <Ionicons name="restaurant-outline" size={20} color="#ff6347" />
      <ThemedText style={styles.logoText}>
        Food<ThemedText style={styles.dashText}>Dash</ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dashText: {
    fontSize: 20,
    color: '#ff6347',
    fontWeight: '800',
  },
});
