// hooks/use-notifications.ts
"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notification.store";
import { listNotifications, unreadCount } from "@/lib/notifications";
import { authCookies } from "@/lib/cookie";
import { isTokenValid } from "@/lib/jwt";

export function useNotifications(open: boolean) {
  const { setItems, setUnread, addItem } = useNotificationStore();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        const [items, count] = await Promise.all([
          listNotifications().catch(() => []),
          unreadCount().catch(() => 0),
        ]);
        if (!cancelled) {
          setItems(items);
          setUnread(count);
        }
      } catch { /* ignore */ }
    })();

    // Build WS URL; append JWT so backend can auth the socket
    const raw = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/notifications/";
    const url = new URL(raw);

    const token = authCookies.getAccessToken();
    if (token && isTokenValid(token)) {
      url.searchParams.set("token", token); // ⚠️ ensure your backend expects "token"
    }

    const ws = new WebSocket(url.toString());

    ws.onmessage = (e) => {
      try {
        const notification = JSON.parse(e.data);
        addItem(notification);
      } catch (err) {
        console.error("Invalid WS payload", err);
      }
    };

    ws.onerror = (err) => console.error("WS error", err);

    return () => {
      cancelled = true;
      try { ws.close(1000, "dialog closed"); } catch {}
    };
  }, [open, setItems, setUnread, addItem]);
}
