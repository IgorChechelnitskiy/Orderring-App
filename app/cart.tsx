import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useAuth } from '@clerk/expo';

export default function CartScreen() {
  const { items, removeItem, totalPrice } = useCartStore();
  const { userId } = useAuth();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleCheckout = () => {
    if (items.length === 0) return;

    createOrder({
      items: items,
      total: totalPrice(),
      user_id: userId || null,
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <ThemedText style={{ fontWeight: 'bold' }}>{item.name}</ThemedText>
        <ThemedText style={{ opacity: 0.6 }}>Qty: {item.quantity}</ThemedText>
        <ThemedText style={{ color: '#2ecc71' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </ThemedText>
      </View>
      <Pressable onPress={() => removeItem(item.id)} disabled={isPending}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 40 }}>
            Your cart is empty 🍕
          </ThemedText>
        }
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <ThemedText style={{ fontSize: 20 }}>Total:</ThemedText>
            <ThemedText style={{ fontSize: 22, fontWeight: 'bold' }}>
              ${totalPrice().toFixed(2)}
            </ThemedText>
          </View>

          <Pressable
            style={[styles.checkoutBtn, isPending && { opacity: 0.7 }]}
            onPress={handleCheckout}
            disabled={isPending}>
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.btnText}>Checkout</ThemedText>
            )}
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
    paddingTop: 20,
    paddingBottom: 20,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  checkoutBtn: {
    backgroundColor: '#ff6347',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
