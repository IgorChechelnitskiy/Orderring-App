import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { DishCard } from '@/components/dish-card';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useSearchStore } from '@/store/searchStore'; // Import your store
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const query = useSearchStore((state) => state.query); // Get current search string

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['searchDishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Filter Logic: Must be isFavourite AND match the header query
  const filteredFavorites = dishes.filter((dish) => {
    const isFav = dish.isFavourite === true;
    const matchesSearch = dish.dishName.toLowerCase().includes(query.toLowerCase());
    return isFav && matchesSearch;
  });

  if (isLoading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DishCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name={query ? 'search-outline' : 'heart-outline'} size={60} color="#888" />
            <ThemedText style={styles.emptyText}>
              {query ? `No favorites matching "${query}"` : "You haven't added any favorites yet."}
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 20 },
  emptyText: { marginTop: 16, opacity: 0.6, textAlign: 'center', fontSize: 16 },
});
