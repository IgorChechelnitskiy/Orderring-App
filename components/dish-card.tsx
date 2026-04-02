import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from './themed-text';
import { useThemeStore } from '@/store/themeStore';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';

export type Dish = {
  id: number;
  dishName: string;
  dishDescription: string;
  price: number;
  imageUrl: string;
  rating: number;
  isFavourite: boolean;
};

export function DishCard({ item }: { item: Dish }) {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const { mutate: toggleFav } = useToggleFavorite();

  console.log('DishCard rendered with item:', item);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/dish/[id]', params: { id: item.id } })}
      style={[styles.dishCard, { backgroundColor: isDarkMode ? '#252D3A' : '#FFFFFF' }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          console.log('Heart pressed for dish:', item.id); // 2. Debug check
          toggleFav({ id: item.id, isFavourite: item.isFavourite });
        }}
        hitSlop={10}
        style={styles.favButton}>
        <Ionicons
          name={item.isFavourite ? 'heart' : 'heart-outline'}
          size={22}
          color={item.isFavourite ? '#ff6347' : '#888'}
        />
      </Pressable>
      <View style={styles.dishInfo}>
        <ThemedText style={styles.dishName}>{item.dishName}</ThemedText>
        <ThemedText style={styles.dishDesc} numberOfLines={2}>
          {item.dishDescription}
        </ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={styles.price}>${item.price}</ThemedText>
          <View style={styles.ratingBadge}>
            <ThemedText style={styles.ratingText}>⭐ {item.rating}</ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dishCard: {
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  favButton: {
    position: 'absolute',
    top: 8,
    left: 8, // Or right: 8, depending on your preference
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 4,
    zIndex: 10,
  },
  dishInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dishDesc: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ecc71',
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { fontSize: 12, fontWeight: '600' },
});
