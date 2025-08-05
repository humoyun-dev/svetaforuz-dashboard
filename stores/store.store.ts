import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StoreType } from "@/types/store.type";

interface StoreState {
  selectedShop: StoreType | null;
  shops: StoreType[];
  addMode: boolean;

  setSelectedShop: (shop: StoreType | null) => void;
  setShops: (shops: StoreType[]) => void;

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
