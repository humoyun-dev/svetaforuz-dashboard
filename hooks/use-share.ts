import { create } from "zustand";

export interface ShareType {
  open: boolean;
  link: string;
}

interface Store {
  share: ShareType;

  setShare: (e: ShareType) => void;
}

export const useShare = create<Store>((set) => ({
  share: {
    open: false,
    link: "",
  },
  setShare: (e: ShareType) => set({ share: e }),
}));
