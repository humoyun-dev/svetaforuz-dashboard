import { create } from "zustand";
import { StockEntryFormType } from "@/types/systems.type";

interface Store {
  open: boolean;

  data: StockEntryFormType;

  setData: (data: StockEntryFormType) => void;

  disabled: boolean;

  setDisabled: (disabled: boolean) => void;

  setOpen: (value: boolean) => void;
}

export const useImportStore = create<Store>((set) => ({
  open: false,

  disabled: false,

  data: {
    count: "",
    unit_price: "",
    currency: "USD",
    is_warehouse: false,
    product: 0,
  },

  setOpen: (value) => set((state) => ({ ...state, open: value })),
  setDisabled: (value) => set((state) => ({ ...state, disabled: value })),
  setData: (value) => set((state) => ({ ...state, data: value })),
}));
