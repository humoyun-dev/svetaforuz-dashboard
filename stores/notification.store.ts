// stores/notification.store.ts
import { create } from "zustand";

export interface Notification {
  id: number;
  verb: string;
  data?: { description?: string; action?: string };
  created_at: string;
  read: boolean;
}

interface NotificationState {
  items: Notification[];
  unread: number;
  setItems: (items: Notification[]) => void;
  addItem: (item: Notification) => void;
  markRead: (id: number) => void;
  setUnread: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  unread: 0,
  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items], unread: s.unread + 1 })),
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unread: Math.max(s.unread - 1, 0),
    })),
  setUnread: (unread) => set({ unread }),
}));
