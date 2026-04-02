import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeStore } from '@/store/themeStore';

type Dish = {
  id: number;
  dishName: string;
  dishDescription: string;
  price: number;
  imageUrl: string;
  rating: number;
  dishSize: string;
};

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('Dishes').select('*').eq('categoryId', id);

      if (error) throw error;
      return data as Dish[];
    },
    staleTime: 1000 * 60 * 10,
  });

  const renderDish = ({ item }: { item: Dish }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/dish/[id]',
          params: { id: item.id },
        })
      }>
      <View style={[styles.dishCard, { backgroundColor: isDarkMode ? '#252D3A' : '#FFFFFF' }]}>
        <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
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
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: (name as string) || 'Category', // This shows the name in the header
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
          headerBackTitle: '',
          headerShadowVisible: false,
        }}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDish}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <ThemedText style={styles.empty}>No dishes found in this category.</ThemedText>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listPadding: { padding: 20 },
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
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
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
  empty: { textAlign: 'center', marginTop: 50, opacity: 0.5 },
});
