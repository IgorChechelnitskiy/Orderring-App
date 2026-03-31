import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import ImageSlider from '@/components/ImageSlider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeStore} from '@/store/themeStore';
import {supabase} from '@/utils/supabase';
import {useQuery} from '@tanstack/react-query';
import {Stack, useRouter} from 'expo-router';
import React from 'react';

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

export default function Page() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  const { data: promotions = [], isLoading: promoLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Promotions').select('*');
      if (error) throw error;
      return data as ProductPromotion[];
    },
    // staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Categories').select('*');
      if (error) throw error;
      return data as ProductCategory[];
    },
    // staleTime: 1000 * 60 * 10,
  });

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageSlider data={promotions} />

        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>

        {catLoading ? (
          <ActivityIndicator size="large" color="#8E8E93" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/category/[id]',
                    params: {
                      id: item.id.toString(),
                      name: item.categoryName,
                    },
                  })
                }
                style={[styles.card, { backgroundColor: isDarkMode ? '#252D3A' : '#E5E9EB' }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <ThemedText style={styles.cardText}>{item.categoryName}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
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
    width: '47%', // Fits 2 columns with a gap
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    // Shadow for light mode
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
});
