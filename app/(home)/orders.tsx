import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { OrderCardSkeleton } from '@/components/order-card-skeleton';

export default function OrdersScreen() {
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  const getStatusStyles = (status: string, isDarkMode: boolean) => {
    switch (status) {
      case 'new':
        return {
          bg: isDarkMode ? 'rgba(46, 204, 113, 0.15)' : '#E8F8F0',
          text: '#27ae60',
        };
      case 'preparing':
        return {
          bg: isDarkMode ? 'rgba(168, 230, 207, 0.15)' : 'rgba(32, 58, 67, 0.1)',
          text: isDarkMode ? '#A8E6CF' : '#203A43',
        };
      case 'cancelled':
        return {
          bg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F2F2F2',
          text: '#8E8E93',
        };
      default:
        return {
          bg: 'rgba(52, 152, 219, 0.1)',
          text: '#3498db',
        };
    }
  };

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <View style={{ padding: 16 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isCancelled = item.status === 'cancelled';
            const statusStyle = getStatusStyles(item.status, isDarkMode);

            return (
              <Pressable
                onPress={() => router.push(`/order/${item.id}` as any)}
                style={[styles.orderCard, isCancelled && { opacity: 0.6 }]}>
                <View style={styles.orderHeader}>
                  <ThemedText
                    style={[styles.orderId, isCancelled && { textDecorationLine: 'line-through' }]}>
                    Order #{item.id.slice(0, 8)}
                  </ThemedText>

                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
                    <ThemedText style={[styles.statusText, { color: statusStyle.text }]}>
                      {item.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                {item.orderItems.map((dish: any, idx: number) => (
                  <ThemedText key={idx} style={styles.itemText}>
                    {dish.quantity}x {dish.name}
                  </ThemedText>
                ))}

                <ThemedText style={styles.totalPrice}>
                  Total: ${item.total_price.toFixed(2)}
                </ThemedText>
              </Pressable>
            );
          }}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 60 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.08)',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemText: {
    fontSize: 14,
    opacity: 0.7,
    marginVertical: 1,
    paddingLeft: 4,
  },
  totalPrice: {
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'right',
    fontSize: 16,
  },
});
