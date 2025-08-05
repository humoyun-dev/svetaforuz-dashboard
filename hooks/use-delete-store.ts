import { create } from "zustand";

interface Store {
  open: boolean;
  url: string;

  setOpen: (value: boolean) => void;
  setUrl: (value: string) => void;
}

export const useDeleteStore = create<Store>((set) => ({
  open: false,
  url: "",

  setOpen: (value) => set((state) => ({ ...state, open: value })),
  setUrl: (value) => set((state) => ({ ...state, url: value })),
}));
