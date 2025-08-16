// lib/notifications.ts
import { api } from "@/lib/http";

export type NotificationItem = {
  id: number;
  verb: string;
  read: boolean;
  data?: { description?: string };
  created_at?: string;
};

// Your NEXT_PUBLIC_SERVER_URL already ends with `/platform/`,
// so we just need the resource name here.
const BASE = "notifications/";

export async function listNotifications(): Promise<NotificationItem[]> {
  const { data } = await api.get(`${BASE}`); // GET /platform/notifications/
  return Array.isArray(data?.results) ? data.results : data;
}

export async function unreadCount(): Promise<number> {
  // GET /platform/notifications/unread_count/
  const { data } = await api.get(`${BASE}unread_count/`);
  return Number(data?.count ?? data?.unread ?? 0);
}

export async function markAsRead(id: number): Promise<void> {
  // POST /platform/notifications/{id}/mark_as_read/
  await api.post(`${BASE}${id}/mark_as_read/`, {});
}

export async function markAllAsRead(ids: number[]): Promise<void> {
  if (!ids.length) return;
  await Promise.allSettled(ids.map((id) => markAsRead(id)));
}
