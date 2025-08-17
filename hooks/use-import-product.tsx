import { create } from "zustand";

interface Store {
  open: boolean;

  setOpen: (value: boolean) => void;
}

export const useImportStore = create<Store>((set) => ({
  open: false,

  setOpen: (value) => set((state) => ({ ...state, open: value })),
}));
