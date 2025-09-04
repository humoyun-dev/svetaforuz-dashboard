import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Store {
  open: boolean;
  id: string;

  setId: (id: string) => void;
  setOpen: (e: boolean) => void;

  _hasHydrated: boolean;
}

export const useStoreForm = create<Store>()(
  devtools(
    persist(
      (set) => ({
        open: false,
        setOpen: (e: boolean) => set({ open: e }),

        id: "",
        setId: (id: string) => set({ id }),

        _hasHydrated: false,
      }),
      {
        name: "store-form-storage",
        partialize: (state) => ({
          open: state.open,
          id: state.id,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "StoreForm" },
  ),
);
