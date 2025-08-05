import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { StaffType, UserType } from "@/types/user.type";

interface UserState {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;

  role: StaffType;
  setRole: (role: StaffType) => void;
  _hasHydrated: boolean;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        setRole: (role) => set({ role }),
        role: "viewer",
        _hasHydrated: false,
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ user: state.user }),

        onRehydrateStorage: () => (state, error) => {
          if (state && !error) {
            state._hasHydrated = true;
          }
        },
      },
    ),
    { name: "UserStore" },
  ),
);
