import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  items: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  setItems: (ids: string[]) => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      isWishlisted: (productId) => get().items.includes(productId),
      setItems: (ids) => set({ items: ids }),
    }),
    { name: "novashop-wishlist" }
  )
);