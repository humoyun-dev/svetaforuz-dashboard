"use client";

import React, { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { StoreType } from "@/types/store.type";
import { Loading } from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { AlertCircle, Moon, Store, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { LogoutIconButton } from "@/components/logout";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "@/components/ui/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { setSecureCookie } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/store.store";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useUserStore } from "@/stores/user.store";

const Page = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { setRole } = useUserStore();

  const shops = useStore((s) => s.shops);
  const selectedShop = useStore((s) => s.selectedShop);
  const setSelectedShop = useStore((s) => s.setSelectedShop);
  const setShops = useStore((s) => s.setShops);

  const isOnline = useOnlineStatus();

  const { data, isLoading, isError } = useFetch<{ results: StoreType[] }>(
    isOnline ? "store/" : null,
  );

  useEffect(() => {
    if (!isOnline) return;

    if (data?.results?.length) {
      setShops(data.results);
    }
  }, [data, isOnline, setShops]);

  const handleSelectShop = (shopId: number) => {
    const shop = shops.find((s) => s.id === shopId) || null;
    setSelectedShop(shop);
  };

  const handleContinue = () => {
    if (!selectedShop) return;
    setSecureCookie("path", selectedShop.role);
    setRole(selectedShop.role);
    router.push(`/${selectedShop.role}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading && isOnline) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b py-4 px-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-lg">{t("shopDashboard")}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <LogoutIconButton />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <CardHeader className="text-center px-0 pb-8">
          <CardTitle className="text-2xl font-medium">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        {!isOnline && !shops.length ? (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("offline_no_data") || "No offline data available"}
            </h3>
            <Button onClick={handleRetry} variant="outline" className="mt-4">
              {t("retry")}
            </Button>
          </div>
        ) : (
          <RadioGroup
            value={selectedShop?.id?.toString()}
            onValueChange={(value) => handleSelectShop(Number(value))}
            className="space-y-3"
          >
            {shops.map((shop) => (
              <div key={shop.id} className="cursor-pointer">
                <RadioGroupItem
                  value={shop.id.toString()}
                  id={`shop-${shop.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`shop-${shop.id}`}
                  className={cn(
                    "flex items-center p-4 rounded-xl cursor-pointer transition-all",
                    "bg-card border border-input shadow-sm hover:shadow-md",
                    "peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary",
                    "[&:has([data-state=checked])]:ring-2 [&:has([data-state=checked])]:ring-primary",
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4 overflow-hidden">
                    {shop.logo ? (
                      <Image
                        src={shop.logo}
                        alt={`${shop.name} logo`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-medium">{shop.name}</h2>
                    <p className="text-sm text-muted-foreground">{shop.role}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <div className="mt-10 space-y-3">
          <Button
            className="w-full h-12"
            disabled={!selectedShop}
            onClick={handleContinue}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
