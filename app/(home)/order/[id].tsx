import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusTheme } from '@/constants/statuses';
import { LocationPickerModal } from '@/components/location-picker-modal';
import { Colors } from '@/constants/theme';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  const currentTheme = isDarkMode ? 'dark' : 'light';
  const theme = Colors[currentTheme];
  const iconColor = isDarkMode ? '#A8E6CF' : '#203A43';
  const iconBoxBg = isDarkMode ? 'rgba(168, 230, 207, 0.2)' : 'rgba(32, 58, 67, 0.1)';

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('Orders').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  const { mutate: proceedToPayment, isPending: isPaying } = useMutation({
    mutationFn: async () => {
      if (!deliveryInfo) {
        Alert.alert('Hold on!', 'Please select a delivery location first.');
        throw new Error('No location');
      }
      const { error } = await supabase
        .from('Orders')
        .update({
          status: 'preparing',
          delivery_address: deliveryInfo.address,
          latitude: deliveryInfo.latitude,
          longitude: deliveryInfo.longitude,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      alert('Payment Successful! Restaurant is preparing your food.');
    },
  });

  const isLocationMissing = !deliveryInfo && !order?.delivery_address;
  const isPayDisabled = isPaying || isLocationMissing || order?.status !== 'new';

  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('Orders').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      Alert.alert('Success', 'Your order has been cancelled.');

      router.replace('/(home)/orders');
    },
  });

  const { mutate: repeatOrder, isPending: isRepeating } = useMutation({
    mutationFn: async () => {
      if (!order) return;

      const newOrder = {
        user_id: order.user_id,
        orderItems: order.orderItems,
        total_price: order.total_price,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('Orders').insert([newOrder]).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Alert.alert('Success', 'Order repeated! You can now proceed to payment.');
      router.push(`/order/${data.id}` as any);
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to repeat order. Please try again.');
      console.error(error);
    },
  });

  if (isLoading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Order Summary', headerBackTitle: 'Back' }} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 }, // Increased padding for safety
        ]}>
        <View style={styles.summaryHeader}>
          <View>
            <ThemedText style={styles.orderNumberTitle}>ORDER ID</ThemedText>
            <ThemedText style={styles.orderIdText}>
              {order?.id ? `#${order.id.slice(0, 12).toUpperCase()}` : ''}
            </ThemedText>
          </View>

          {order?.status && (
            <View
              style={[
                styles.compactBadge,
                { backgroundColor: getStatusTheme(order.status, isDarkMode).bg },
              ]}>
              <Ionicons
                name={getStatusTheme(order.status, isDarkMode).icon as any}
                size={14}
                color={getStatusTheme(order.status, isDarkMode).text}
              />
              <ThemedText
                style={[
                  styles.compactBadgeText,
                  { color: getStatusTheme(order.status, isDarkMode).text },
                ]}>
                {order.status.toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <ThemedText style={styles.sectionTitle}>Items Ordered</ThemedText>

        {order?.orderItems?.map((item: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemQty}>{`Quantity: ${item.quantity}`}</ThemedText>
            </View>
            <ThemedText style={styles.itemPrice}>
              {`$${(item.price * item.quantity).toFixed(2)}`}
            </ThemedText>
          </View>
        ))}
        <View style={styles.divider} />
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
        <View style={styles.locationSection}>
          <ThemedText style={styles.sectionTitle}>Delivery Location</ThemedText>

          <Pressable
            style={styles.locationPicker}
            onPress={() => order?.status === 'new' && setIsMapVisible(true)}>
            <View style={[styles.iconBox, { backgroundColor: iconBoxBg }]}>
              <Ionicons name="location" size={22} color={iconColor} />
            </View>

            <ThemedText style={[styles.locationText, { color: theme.text }]} numberOfLines={2}>
              {order?.delivery_address || deliveryInfo?.address || 'Tap to set delivery address'}
            </ThemedText>

            {order?.status === 'new' && (
              <ThemedText style={styles.locationActionText}>
                {deliveryInfo || order?.delivery_address ? 'Edit' : 'Add'}
              </ThemedText>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <LocationPickerModal
        visible={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        onSelect={(loc: any) => setDeliveryInfo(loc)}
      />

      <View
        style={[
          styles.footer,
          {
            borderTopColor: isDarkMode ? '#333' : '#eee',
            paddingBottom: insets.bottom + 65,
            backgroundColor: isDarkMode ? '#0F2027' : '#F0F4F5',
          },
        ]}>
        {order?.status === 'new' && (
          <Pressable
            style={[styles.payButton, isPayDisabled && styles.payButtonDisabled]}
            onPress={() => proceedToPayment(deliveryInfo)}
            disabled={isPayDisabled}>
            {isPaying ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={[styles.payText, isPayDisabled && { opacity: 0.7 }]}>
                {isLocationMissing
                  ? 'Select Location to Pay'
                  : `Pay Now • $${order?.total_price.toFixed(2)}`}
              </ThemedText>
            )}
          </Pressable>
        )}

        {(order?.status === 'delivered' || order?.status === 'cancelled') && (
          <Pressable
            style={[styles.repeatButton, isRepeating && { opacity: 0.7 }]}
            onPress={() => repeatOrder()}
            disabled={isRepeating}>
            {isRepeating ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="refresh-outline" size={20} color="white" />
                <ThemedText style={styles.payText}>Repeat Order</ThemedText>
              </>
            )}
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  scrollContent: { padding: 20 },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumberTitle: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  compactBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    opacity: 0.9,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  itemInfo: { flex: 1, marginLeft: 16 },
  itemName: { fontWeight: '700', fontSize: 15 },
  itemQty: { opacity: 0.5, fontSize: 13, marginTop: 2 },
  itemPrice: { fontWeight: '700', fontSize: 15 },

  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginVertical: 24,
  },
  totalContainer: {
    backgroundColor: 'rgba(128,128,128,0.05)',
    padding: 20,
    borderRadius: 20,
    gap: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', opacity: 0.8 },
  finalTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.1)',
  },
  totalText: { fontSize: 20, fontWeight: '900' },
  payButton: {
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    backgroundColor: '#95a5a6',
    shadowOpacity: 0,
    elevation: 0,
  },
  payText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  cancelContainer: { marginTop: 20, alignItems: 'center' },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  cancelText: { color: '#ff6347', fontWeight: '700', fontSize: 14 },
  cancelHint: { fontSize: 11, opacity: 0.4, marginTop: 4 },
  repeatButton: {
    backgroundColor: '#203A43',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  locationSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
    marginTop: 8,
    gap: 12,
    minHeight: 64,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  locationActionText: {
    fontSize: 12,
    color: '#ff6347',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginLeft: 8,
  },
});
