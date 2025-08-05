import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Currency } from "@/types/products.type";

interface CurrencyStore {
  usd: number;
  currency: Currency;

  setCurrency: (currency: Currency) => void;
  setUsd: (usd: number) => void;

  changeMode: boolean;
  toggleChangeMode: (value?: boolean) => void;
  clearState: () => void;

  _hasHydrated: boolean;
}

export const useCurrencyStore = create<CurrencyStore>()(
  devtools(
    persist(
      (set) => ({
        usd: 0,
        currency: "UZS",

        setCurrency: (currency) => set({ currency }),
        setUsd: (usd) => set({ usd }),

        changeMode: false,
        toggleChangeMode: (value) =>
          set((state) => ({ changeMode: value ?? !state.changeMode })),

        clearState: () =>
          set({
            usd: 0,
            currency: "UZS",
            changeMode: false,
          }),
        _hasHydrated: false,
      }),
      {
        name: "currency-storage",
        partialize: (state) => ({
          usd: state.usd,
          currency: state.currency,
          changeMode: state.changeMode,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "CurrencyStore" },
  ),
);
