import { supabase } from '@/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Inside hooks/useToggleFavorite.ts

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFavourite }: { id: number; isFavourite: boolean }) => {
      // Ensure we use Number(id) just in case it's passed as a string from params
      const { error } = await supabase
        .from('Dishes')
        .update({ isFavourite: !isFavourite })
        .eq('id', Number(id));

      if (error) throw error;
    },

    onSuccess: (data, variables) => {
      // 1. Refresh the specific dish detail page
      queryClient.invalidateQueries({ queryKey: ['dish', String(variables.id)] });

      // 2. Refresh the search/home lists
      queryClient.invalidateQueries({ queryKey: ['searchDishes'] });

      // 3. Refresh general dishes lists
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },

    // Optional: Add Optimistic Update for the specific dish key
    onMutate: async ({ id, isFavourite }) => {
      const specificKey = ['dish', String(id)];
      await queryClient.cancelQueries({ queryKey: specificKey });

      const previousDish = queryClient.getQueryData(specificKey);

      queryClient.setQueryData(specificKey, (old: any) => {
        if (!old) return old;
        return { ...old, isFavourite: !isFavourite };
      });

      return { previousDish };
    },
  });
};
