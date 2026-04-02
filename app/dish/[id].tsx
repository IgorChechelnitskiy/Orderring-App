import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const { data: dish, isLoading } = useQuery({
    queryKey: ['dish', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('Dishes').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  const handleAddToOrder = () => {
    if (!dish) return;

    addItem({
      id: dish.id,
      name: dish.dishName,
      price: dish.price,
      quantity: quantity,
      image: dish.imageUrl,
    });
    router.back();
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerTintColor: '#fff' }} />
      <ScrollView bounces={false}>
        <Image source={{ uri: dish?.imageUrl }} style={styles.image} />
        <View
          style={[styles.infoContainer, { backgroundColor: isDarkMode ? '#121212' : '#F8F9FA' }]}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.title}>{dish?.dishName}</ThemedText>
            <ThemedText style={styles.price}>${dish?.price}</ThemedText>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <ThemedText style={styles.ratingText}>{dish?.rating} • 20-30 min</ThemedText>
          </View>
          <ThemedText style={styles.description}>
            {dish?.dishDescription || 'No description available for this delicious meal.'}
          </ThemedText>
          <View style={styles.quantityContainer}>
            <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
              <Ionicons name="remove" size={24} color={isDarkMode ? 'white' : 'black'} />
            </Pressable>
            <ThemedText style={styles.qtyText}>{quantity}</ThemedText>
            <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
              <Ionicons name="add" size={24} color={isDarkMode ? 'white' : 'black'} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: isDarkMode ? '#333' : '#eee' }]}>
        <Pressable style={styles.addToCartBtn} onPress={handleAddToOrder}>
          <ThemedText style={styles.btnText}>
            Add to Order • ${(dish?.price * quantity).toFixed(2)}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 350 },
  infoContainer: {
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: 'bold', lineHeight: 32 },
  price: { fontSize: 22, fontWeight: '700', color: '#2ecc71' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  ratingText: { marginLeft: 6, opacity: 0.6 },
  description: { fontSize: 16, lineHeight: 24, opacity: 0.8, marginTop: 10 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  qtyBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  qtyText: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 20 },
  footer: { padding: 20, paddingBottom: 34 },
  addToCartBtn: {
    backgroundColor: '#ff6347',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
