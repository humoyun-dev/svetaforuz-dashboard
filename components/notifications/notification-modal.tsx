"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { markAsRead, markAllAsRead } from "@/lib/notifications";
import { useNotificationStore } from "@/stores/notification.store";
import { useNotifications } from "@/hooks/use-notifications";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function NotificationModal({ open, onOpenChange }: Props) {
  const { items, unread, markRead } = useNotificationStore();
  const [tab, setTab] = useState<"all" | "unread">("all");
  useNotifications(open);

  const uniqueItems = useMemo(() => {
    const seen = new Set<number>();
    return items.filter((n) => (seen.has(n.id) ? false : (seen.add(n.id), true)));
  }, [items]);

  const unreadItems = useMemo(() => uniqueItems.filter((n) => !n.read), [uniqueItems]);

  async function handleMark(id: number) {
    try {
      await markAsRead(id);
      markRead(id);
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  }

  async function handleMarkAll() {
    try {
      const ids = unreadItems.map((n) => n.id);
      await markAllAsRead(ids);
      ids.forEach((id) => markRead(id));
    } catch (e) {
      console.error("Failed to mark all read", e);
    }
  }

  function List({ data }: { data: typeof uniqueItems }) {
    if (data.length === 0) {
      return <div className="p-4 text-sm text-muted-foreground">No notifications</div>;
    }
    return (
      <ul className="divide-y">
        {data.map((n, i) => (
          <li key={n.id ?? `${n.verb}-${i}`} className="flex justify-between p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{n.verb}</p>
              {n.data?.description && (
                <p className="truncate text-sm text-muted-foreground">{n.data.description}</p>
              )}
            </div>
            {!n.read && (
              <button onClick={() => handleMark(n.id)} className="text-xs text-primary">
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-md">
        {/* Required for a11y; hidden visually */}
        <DialogHeader className="sr-only">
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between px-4 pt-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unread > 0 && (
                  <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    {unread}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <button
            onClick={handleMarkAll}
            className="text-xs text-primary disabled:opacity-50"
            disabled={unreadItems.length === 0}
          >
            Mark all as read
          </button>
        </div>

        <ScrollArea className="h-80">
          <Tabs value={tab}>
            <TabsContent value="all" className="m-0">
              <List data={uniqueItems} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <List data={unreadItems} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
