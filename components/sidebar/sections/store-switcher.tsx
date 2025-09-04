"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { useStore } from "@/stores/store.store";
import { setSecureCookie } from "@/lib/cookie";
import useFetch from "@/hooks/use-fetch";
import Image from "@/components/ui/image";
import type { StoreType } from "@/types/store.type";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useUserStore } from "@/stores/user.store";
import { useTranslation } from "react-i18next";
import { useStoreForm } from "@/hooks/use-store-form";

function StoreLogo({
  logo,
  name,
  size = "md",
}: {
  logo?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return logo ? (
    <Image
      src={logo}
      alt={name ?? "Shop"}
      className={`rounded-md shrink-0 ${sizeClasses[size]}`}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-md bg-muted text-muted-foreground font-medium`}
    >
      {name?.[0]?.toUpperCase() ?? "S"}
    </div>
  );
}

export function StoreSwitcher() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const isOnline = useOnlineStatus();
  const { setRole } = useUserStore();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useFetch<{ results: StoreType[] }>(
    isOnline ? "store/" : null,
  );

  const { setOpen } = useStoreForm();

  const { shops, selectedShop, setShops, setSelectedShop } = useStore();

  React.useEffect(() => {
    if (isOnline && data?.results?.length) {
      setShops(data.results);

      if (!selectedShop) {
        const firstShop = data.results[0];
        setSelectedShop(firstShop);
        setSecureCookie("path", firstShop.role);
        router.replace(`/${firstShop.role}`);
      }
    }
  }, [data, isOnline]);

  const handleStoreSelect = (shop: StoreType) => {
    if (shop.id === selectedShop?.id) return;

    setRole(shop.role);
    setSelectedShop(shop);
    setSecureCookie("path", shop.role);
    router.replace(`/${shop.role}`);
  };

  if (isLoading && isOnline) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-muted animate-pulse" />
            <div className="ml-3 flex-1 space-y-1">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted/70 animate-pulse" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError && isOnline) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Button variant="outline" size="lg" className="w-full justify-start">
            <AlertCircle className="mr-2 size-4" />
            {t(
              "error.failed_to_load_stores",
              "Do‘konlar yuklanmadi — qayta urinib ko‘ring",
            )}
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!selectedShop || !shops.length) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <StoreLogo logo={selectedShop.logo} name={selectedShop.name} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedShop.name}
                </span>
                <span className="truncate text-xs capitalize">
                  {t(`roles.${selectedShop.role}`, selectedShop.role)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("chooseShop.stores")} ({shops.length})
            </DropdownMenuLabel>

            {shops.map((shop, index) => (
              <DropdownMenuItem
                key={shop.id}
                onClick={() => handleStoreSelect(shop)}
                className="gap-2 p-2"
                disabled={shop.id === selectedShop.id}
              >
                <StoreLogo logo={shop.logo} name={shop.name} size="sm" />
                <span className="flex-1 truncate">{shop.name}</span>
                {index < 9 && (
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                {t("chooseShop.addShop")}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
