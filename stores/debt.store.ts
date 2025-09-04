import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  TransactionDocumentForm,
  TransactionDocumentProductForm,
} from "@/types/transaction.type";

interface State {
  addMode: boolean;
  submitMode: boolean;
  debtItem: TransactionDocumentProductForm | null;
  debtItems: TransactionDocumentProductForm[];
  debt: TransactionDocumentForm;
  index: number | null;
  _hasHydrated: boolean;

  setAddMode: (value: boolean) => void;
  setDebtItem: (item: TransactionDocumentProductForm | null) => void;
  addDebtItem: (item: TransactionDocumentProductForm) => void;
  updateDebtItem: (index: number, item: TransactionDocumentProductForm) => void;
  clearDebtItems: () => void;
  removeDebtItem: (index: number) => void;
  setDebt: (debt: TransactionDocumentForm) => void;
  setIndex: (index: number) => void;
  setSubmitMode: (value: boolean) => void;

  resetDebt: () => void;

  setHydrated: (value: boolean) => void;
}

export const useDebtStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        addMode: false,
        submitMode: false,
        debtItem: null,
        debtItems: [],
        debt: {
          currency: "USD",
          method: "transfer",
          cash_amount: "0",
          products: [],
        },
        _hasHydrated: false,
        index: null,

        setAddMode: (value) => set({ addMode: value }),
        setDebtItem: (item) => set({ debtItem: item }),
        addDebtItem: (item) =>
          set((state) => ({
            debtItems: [...state.debtItems, item],
          })),
        updateDebtItem: (index, updatedItem) =>
          set((state) => ({
            debtItems: state.debtItems.map((item, i) =>
              i === index ? updatedItem : item,
            ),
          })),
        removeDebtItem: (index) =>
          set((state) => ({
            debtItems: state.debtItems.filter((_, i) => i !== index),
          })),
        clearDebtItems: () => set({ debtItems: [] }),
        setDebt: (debt) => set({ debt }),
        setIndex: (index) => set({ index }),
        setSubmitMode: (value: boolean) => set({ submitMode: value }),
        resetDebt: () =>
          set({
            debtItems: [],
            debt: {
              currency: "USD",
              method: "transfer",
              cash_amount: "0",
              products: [],
            },
            addMode: false,
            submitMode: false,
            debtItem: null,
            index: null,
          }),

        setHydrated: (value) => set({ _hasHydrated: value }),
      }),
      {
        name: "debt-storage",
        partialize: (state) => ({
          addMode: state.addMode,
          debtItem: state.debtItem,
          debtItems: state.debtItems,
          debt: state.debt,
          submitMode: state.submitMode,
          index: state.index,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    {
      name: "DebtStore",
    },
  ),
);
