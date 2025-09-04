import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { TransactionUserFormType } from "@/types/transaction.type";

interface Store {
  open: boolean;
  setOpen: (e: boolean) => void;

  form: TransactionUserFormType;
  setForm: (form: TransactionUserFormType) => void;

  dOpen: boolean;
  setDOpen: (e: boolean) => void;

  refetch?: () => void;
  setRefetch: (fn?: () => void) => void;

  _hasHydrated: boolean;
}

export const useDebtForm = create<Store>()(
  devtools(
    persist(
      (set) => ({
        open: false,
        setOpen: (e: boolean) => set({ open: e }),

        dOpen: false,
        setDOpen: (e: boolean) => set({ dOpen: e }),

        form: {
          phone_number: "",
          first_name: "",
          last_name: "",
        },
        setForm: (form: TransactionUserFormType) => set({ form }),

        refetch: undefined,
        setRefetch: (fn?: () => void) => set({ refetch: fn }),

        _hasHydrated: false,
      }),
      {
        name: "debt-hook-storage",
        partialize: (state) => ({
          open: state.open,
          dOpen: state.dOpen,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "DebtUserForm" },
  ),
);
