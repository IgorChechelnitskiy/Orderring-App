import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DishCard } from '@/components/dish-card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryDishSkeleton } from '@/components/category-dish-skeleton';

type Dish = {
  id: number;
  dishName: string;
  dishDescription: string;
  price: number;
  imageUrl: string;
  rating: number;
  dishSize: string;
  isFavourite: boolean;
};

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('*')
        .eq('categoryId', id)
        .order('id', { ascending: true });
      if (error) throw error;
      return data as Dish[];
    },
  });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: (name as string) || 'Category',
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
          headerBackTitle: '',
          headerShadowVisible: false,
        }}
      />

      {isLoading ? (
        <View style={styles.listPadding}>
          {[1, 2, 3, 4, 5].map((item) => (
            <CategoryDishSkeleton key={item} />
          ))}
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <DishCard item={item} />}
          contentContainerStyle={[styles.listPadding, { paddingBottom: 70 + insets.bottom }]}
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
