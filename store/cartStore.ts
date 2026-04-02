import { create } from 'zustand';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === newItem.id);

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i,
        ),
      });
    } else {
      set({ items: [...items, newItem] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
