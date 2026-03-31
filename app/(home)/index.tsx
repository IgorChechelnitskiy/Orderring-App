import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ImageSlider from '@/components/ImageSlider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

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

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [promotions, setPromotions] = useState<ProductPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchPromotions();
  }, []);

  useEffect(() => {
    console.log(promotions);
  }, [promotions]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('Categories').select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching categories:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase.from('Promotions').select('*');

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching promotions:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageSlider data={promotions} />

        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color="#8E8E93" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.card,
                  { backgroundColor: isDarkMode ? '#252D3A' : '#E5E9EB' }, // Our lighter dark mode color
                ]}>
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
