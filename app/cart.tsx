import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { items, removeItem, totalPrice, clearCart } = useCartStore();

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
      <Pressable onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={items}
        renderItem={renderItem}
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
          <Pressable style={styles.checkoutBtn} onPress={() => alert('Proceed to Payment')}>
            <ThemedText style={styles.btnText}>Checkout</ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  footer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  checkoutBtn: { backgroundColor: '#ff6347', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
