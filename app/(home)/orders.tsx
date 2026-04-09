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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const { userId, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();

  // const { data: orders, isLoading } = useQuery({
  //   queryKey: ['orders', userId],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from('Orders')
  //       .select('*')
  //       .eq('user_id', userId)
  //       .order('created_at', { ascending: false });
  //     if (error) throw error;
  //     return data;
  //   },
  // });

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      let query = supabase.from('Orders').select('*');

      if (userId) {
        // CASE 1: Authenticated User - Get all their history
        query = query.eq('user_id', userId);
      } else {
        // CASE 2: Guest User - Get only the order ID stored on this device
        const guestOrderId = await AsyncStorage.getItem('last_guest_order_id');

        if (!guestOrderId) return []; // No orders yet

        query = query.eq('id', guestOrderId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isLoaded, // Don't run until Auth state is known
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
      ) : orders?.length === 0 ? ( // Removed the extra ({ and )
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyTitle}>No active orders</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {userId
              ? "You haven't ordered anything yet."
              : 'Guest orders appear here after checkout.'}
          </ThemedText>
          <Pressable style={styles.goButton} onPress={() => router.push('/')}>
            <ThemedText style={{ color: '#fff' }}>Browse Menu</ThemedText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 60 }}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -60, // Centers it visually on the screen
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  goButton: {
    marginTop: 30,
    backgroundColor: '#2ecc71', // Match your branding
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  goButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
