import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ items, total }: { items: any[]; total: number }) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('Orders')
        .insert([
          {
            user_id: userId,
            total_price: total,
            orderItems: items, // This array goes into your JSONB column
            status: 'new', // Matches your Enum default
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });

      router.push(`/order/${data.id}` as any);
    },
    onError: (error) => {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
    },
  });
};
