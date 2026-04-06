import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ImageSlider from '@/components/ImageSlider';
import { useThemeStore } from '@/store/themeStore';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useSearchStore } from '@/store/searchStore';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/skeleton';
import { SearchSkeleton } from '@/components/search-skeleton';

type ProductCategory = {
  id: number;
  categoryName: string;
  imageUrl: string;
  categoryDescription: string;
};

type ProductPromotion = {
  id: number;
  promotionName: string;
  imageUrl: string;
  promotionDescription: string;
};

// function SearchSkeleton() {
//   return null;
// }

export default function Page() {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const searchQuery = useSearchStore((state) => state.query);
  const insets = useSafeAreaInsets();
  const bottomPadding = 65 + insets.bottom + 20;

  const { data: promotions = [], isLoading: promoLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Promotions').select('*');
      if (error) throw error;
      return data as ProductPromotion[];
    },
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Categories').select('*');
      if (error) throw error;
      return data as ProductCategory[];
    },
  });

  const { data: allDishes = [], isLoading: searchLoading } = useQuery({
    queryKey: ['searchDishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('id, dishName, price, imageUrl, isFavourite');

      if (error) throw error;
      return data;
    },
  });

  const filteredDishes = allDishes?.filter((dish) =>
    dish.dishName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isSearching = searchQuery.length > 0;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      {!isSearching ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}>
          {promoLoading ? (
            <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
              <Skeleton width="100%" height={200} borderRadius={20} />
            </View>
          ) : (
            <ImageSlider data={promotions} />
          )}

          <ThemedText style={styles.sectionTitle}>Categories</ThemedText>

          {catLoading ? (
            <View style={styles.categoryGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.card,
                    { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
                  ]}>
                  <Skeleton width="100%" height={100} borderRadius={12} />
                  <Skeleton width="80%" height={14} borderRadius={4} style={{ marginTop: 10 }} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.categoryGrid}>
              {categories.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({ pathname: '/category/[id]', params: { id: item.id.toString() } })
                  }
                  style={[styles.card, { backgroundColor: isDarkMode ? '#252D3A' : '#E5E9EB' }]}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <ThemedText style={styles.cardText}>{item.categoryName}</ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={[styles.searchOverlay, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
          {isSearching && searchLoading ? (
            <View style={{ marginTop: 10 }}>
              {[...Array(6)].map((_, i) => (
                <SearchSkeleton key={i} />
              ))}
            </View>
          ) : (
            <FlatList
              data={filteredDishes}
              contentContainerStyle={{ paddingBottom: bottomPadding }}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={
                <ThemedText style={styles.searchCount}>
                  {filteredDishes?.length} results found
                </ThemedText>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.searchResultItem}
                  onPress={() =>
                    router.push({ pathname: '/dish/[id]', params: { id: item.id.toString() } })
                  }>
                  <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <ThemedText style={styles.resultName}>{item.dishName}</ThemedText>
                    <ThemedText style={styles.resultPrice}>${item.price}</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    No dishes match &#34;{searchQuery}&#34;
                  </ThemedText>
                </View>
              }
            />
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#ccc',
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchOverlay: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchCount: {
    fontSize: 14,
    opacity: 0.6,
    marginVertical: 15,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultPrice: {
    fontSize: 14,
    color: '#2ecc71',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});
