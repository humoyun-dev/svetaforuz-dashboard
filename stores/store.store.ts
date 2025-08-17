import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StoreType } from "@/types/store.type";

interface StoreState {
  selectedShop: StoreType | null;
  shops: StoreType[];
  addMode: boolean;

  setSelectedShop: (shop: StoreType | null) => void;
  setShops: (shops: StoreType[]) => void;

  updateShop: (item: StoreType) => void;

  toggleAddMode: (value?: boolean) => void;
  clearState: () => void;
  _hasHydrated: boolean;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedShop: null,
        shops: [],
        addMode: false,

        updateShop: (item) =>
          set((state) => {
            const idx = state.shops.findIndex((s) => s.id === item.id);
            let shops: StoreType[];
            if (idx === -1) {
              shops = [...state.shops, item];
            } else {
              shops = state.shops.map((s) =>
                s.id === item.id ? { ...s, ...item } : s,
              );
            }
            const selectedShop =
              state.selectedShop?.id === item.id
                ? { ...state.selectedShop, ...item }
                : state.selectedShop;
            return { shops, selectedShop };
          }),

        setSelectedShop: (shop) => set({ selectedShop: shop }),
        setShops: (shops) => set({ shops }),
        toggleAddMode: (value) =>
          set((state) => ({ addMode: value ?? !state.addMode })),
        clearState: () =>
          set({
            selectedShop: null,
            shops: [],
            addMode: false,
          }),
        _hasHydrated: false,
      }),
      {
        name: "shop-storage",
        partialize: (state) => ({
          selectedShop: state.selectedShop,
          shops: state.shops,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "ShopStore" },
  ),
);
