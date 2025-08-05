import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SettingsStore {
  open: boolean;

  activeSection: string;

  setActiveSection: (section: string) => void;

  setOpen: (e: boolean) => void;
  _hasHydrated: boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        open: false,
        activeSection: "account",
        setActiveSection: (section: string) => set({ activeSection: section }),
        setOpen: (e: boolean) => set({ open: e }),

        _hasHydrated: false,
      }),
      {
        name: "settings-storage",
        partialize: (state) => ({
          open: state.open,
          activeSection: state.activeSection,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "SettingsStore" },
  ),
);

export function openSettingsModal() {
  if (typeof window !== "undefined") {
    window.location.hash = "settings";
  }
}

export function closeSettingsModal() {
  history.replaceState(null, "", window.location.pathname);
}
