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

export default function OrdersScreen() {
  const { userId } = useAuth();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#2ecc71'; // Green
      case 'preparing':
        return '#f1c40f'; // Yellow
      case 'cancelled':
        return '#95a5a6'; // Grey
      default:
        return '#3498db'; // Blue
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isCancelled = item.status === 'cancelled';

          return (
            <Pressable
              onPress={() => router.push(`/order/${item.id}` as any)}
              style={[
                styles.orderCard,
                isCancelled && { opacity: 0.6 }, // Dim the card if cancelled
              ]}>
              <View style={styles.orderHeader}>
                <ThemedText
                  style={[
                    styles.orderId,
                    isCancelled && { textDecorationLine: 'line-through' }, // Strike through ID
                  ]}>
                  Order #{item.id.slice(0, 8)}
                </ThemedText>

                {/* Use your getStatusColor helper here! */}
                <View
                  style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <ThemedText style={styles.statusText}>{item.status.toUpperCase()}</ThemedText>
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
        contentContainerStyle={{ padding: 16 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginBottom: 16,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  itemText: { opacity: 0.7, marginVertical: 2 },
  totalPrice: { fontWeight: '700', marginTop: 8, textAlign: 'right' },
});
