import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/store/themeStore';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const queryClient = useQueryClient();

  // 1. Fetch the Order Data
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('Orders').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  // 2. Payment Mutation (Simulated)
  const { mutate: proceedToPayment, isPending: isPaying } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('Orders').update({ status: 'preparing' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      alert('Payment Successful! Restaurant is preparing your food.');
    },
  });

  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('Orders')
        .update({ status: 'cancelled' }) // Update status instead of deleting row
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      // 1. Refresh the specific order data
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      // 2. Refresh the main orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      Alert.alert('Success', 'Your order has been cancelled.');

      // Optional: Stay on page to see the 'CANCELLED' status,
      // or go back to the list
      router.replace('/(home)/orders');
    },
  });

  const handleCancelPress = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelOrder() },
    ]);
  };

  if (isLoading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Order Summary', headerBackTitle: 'Back' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Header */}
        <View style={[styles.statusCard, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF' }]}>
          <ThemedText style={styles.sectionTitle}>Status</ThemedText>
          <View style={styles.statusRow}>
            <Ionicons name="time-outline" size={20} color="#ff6347" />
            <ThemedText style={styles.statusValue}>{order?.status.toUpperCase()}</ThemedText>
          </View>
        </View>

        {/* Items List */}
        <ThemedText style={styles.sectionTitle}>Items Ordered</ThemedText>
        {order?.orderItems.map((item: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemQty}>Quantity: {item.quantity}</ThemedText>
            </View>
            <ThemedText style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </ThemedText>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Total Summary */}
        <View style={styles.totalContainer}>
          <View style={styles.summaryRow}>
            <ThemedText>Subtotal</ThemedText>
            <ThemedText>${order?.total_price.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Delivery Fee</ThemedText>
            <ThemedText>$0.00</ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.finalTotal]}>
            <ThemedText style={styles.totalText}>Total</ThemedText>
            <ThemedText style={styles.totalText}>${order?.total_price.toFixed(2)}</ThemedText>
          </View>
          {order?.status === 'new' && (
            <View style={styles.cancelContainer}>
              <Pressable
                style={[styles.cancelButton, isCancelling && { opacity: 0.5 }]}
                onPress={() => {
                  Alert.alert(
                    'Cancel Order',
                    'Are you sure you want to delete this order? This action cannot be undone.',
                    [
                      {
                        text: 'No',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes, Cancel',
                        style: 'destructive',
                        onPress: () => cancelOrder(),
                      },
                    ],
                  );
                }}
                disabled={isCancelling || isPaying}>
                {isCancelling ? (
                  <ActivityIndicator color="#ff6347" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#ff6347" />
                    <ThemedText style={styles.cancelText}>Cancel Order</ThemedText>
                  </>
                )}
              </Pressable>
              <ThemedText style={styles.cancelHint}>
                You can only cancel orders that are in &#39;NEW&#39; status.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Payment Button */}
      {order?.status === 'new' && (
        <View style={[styles.footer, { borderTopColor: isDarkMode ? '#333' : '#eee' }]}>
          <Pressable
            style={styles.payButton}
            onPress={() => proceedToPayment()}
            disabled={isPaying}>
            {isPaying ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.payText}>
                Pay Now • ${order?.total_price.toFixed(2)}
              </ThemedText>
            )}
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  scrollContent: { padding: 20 },
  statusCard: { padding: 16, borderRadius: 12, marginBottom: 24, elevation: 2, shadowOpacity: 0.1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusValue: { marginLeft: 8, fontWeight: '700', color: '#ff6347' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  itemImage: { width: 50, height: 50, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontWeight: '600' },
  itemQty: { opacity: 0.6, fontSize: 12 },
  itemPrice: { fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(128,128,128,0.2)', marginVertical: 20 },
  totalContainer: { gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  finalTotal: { marginTop: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1 },
  payButton: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 16, alignItems: 'center' },
  payText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cancelContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6347',
    gap: 8,
  },
  cancelText: {
    color: '#ff6347',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelHint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});
