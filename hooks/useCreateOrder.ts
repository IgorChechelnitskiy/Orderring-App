import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  return useMutation({
    // 1. Accepts the user_id (which might be null for guests)
    mutationFn: async ({
      items,
      total,
      user_id,
    }: {
      items: any[];
      total: number;
      user_id: string | null;
    }) => {
      const { data, error } = await supabase
        .from('Orders')
        .insert([
          {
            user_id: user_id,
            total_price: total,
            orderItems: items,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: async (data) => {
      // 2. If it was a guest order, save the ID to the device
      if (!userId) {
        await AsyncStorage.setItem('last_guest_order_id', data.id);
      }

      // 3. Clean up the app state
      clearCart();

      // 4. Refresh the orders list in the background
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });

      // 5. Send user to the specific order page
      router.push(`/order/${data.id}` as any);
    },

    onError: (error) => {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
    },
  });
};
