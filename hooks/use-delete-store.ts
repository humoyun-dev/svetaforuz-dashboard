import { create } from "zustand";

interface Store {
  open: boolean;
  url: string;

  setOpen: (value: boolean) => void;
  setUrl: (value: string) => void;

  refetch?: () => void;
  setRefetch: (fn?: () => void) => void;

  openModal: (url: string, open: boolean) => void;
}

export const useDeleteStore = create<Store>((set) => ({
  open: false,
  url: "",

  openModal: (url, open) => set({ open: open, url: url }),

  refetch: undefined,
  setRefetch: (fn?: () => void) => set({ refetch: fn }),

  setOpen: (value) => set((state) => ({ ...state, open: value })),
  setUrl: (value) => set((state) => ({ ...state, url: value })),
}));
