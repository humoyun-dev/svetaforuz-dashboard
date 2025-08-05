"use client";

import type React from "react";
import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Laptop,
  Smartphone,
  Monitor,
  Chrome,
  Apple,
  ComputerIcon as Windows,
  LaptopIcon as Linux,
  Globe,
  Clock,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import type { DeviceType } from "@/types/user.type";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useTranslation } from "react-i18next";

const DEVICE_ICONS = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Monitor,
} as const;

const OS_ICONS = {
  mac: Apple,
  ios: Apple,
  windows: Windows,
  linux: Linux,
  android: Linux,
} as const;

const BROWSER_ICONS = {
  chrome: Chrome,
  safari: Apple,
  firefox: Globe,
  edge: Globe,
} as const;

const getDeviceIcon = (deviceType: string) => {
  return DEVICE_ICONS[deviceType as keyof typeof DEVICE_ICONS] || Monitor;
};

const getOSIcon = (os: string) => {
  const osLower = os.toLowerCase();
  for (const [key, icon] of Object.entries(OS_ICONS)) {
    if (osLower.includes(key)) return icon;
  }
  return Monitor;
};

const getBrowserIcon = (browser: string) => {
  const browserLower = browser.toLowerCase();
  for (const [key, icon] of Object.entries(BROWSER_ICONS)) {
    if (browserLower.includes(key)) return icon;
  }
  return Globe;
};

const DeviceItem = memo(function DeviceItem({
  device,
  isSelected,
  onDeviceClick,
  onSignOut,
  formatLastLogin,
}: {
  device: DeviceType;
  isSelected: boolean;
  onDeviceClick: (id: number) => void;
  onSignOut: (deviceId: number, e: React.MouseEvent) => Promise<void>;
  formatLastLogin: (timestamp: string) => string;
}) {
  const { t } = useTranslation();
  const DeviceIcon = useMemo(
    () => getDeviceIcon(device.device_type),
    [device.device_type],
  );
  const OSIcon = useMemo(() => getOSIcon(device.os), [device.os]);
  const BrowserIcon = useMemo(
    () => getBrowserIcon(device.browser),
    [device.browser],
  );

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected
          ? "ring-2 ring-primary ring-offset-2 shadow-md"
          : "hover:border-muted-foreground/50",
      )}
      onClick={() => onDeviceClick(device.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <DeviceIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {device.brand} {device.model}
                </span>
                {device.is_active && (
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600 text-white text-xs"
                  >
                    {t("devices.active")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <OSIcon className="w-4 h-4" />
                  <span>{device.os}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BrowserIcon className="w-4 h-4" />
                  <span>{device.browser}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {t("devices.last_login")}:{" "}
                  {formatLastLogin(device.last_login)}
                </span>
                <Globe className="w-3 h-3 ml-2" />
                <span>
                  {device.ip_address} ({device.where})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {device.is_active ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => onSignOut(device.id, e)}
                className="ml-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("devices.sign_out")}
              </Button>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                {t("devices.inactive")}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      {isSelected && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
      )}
    </Card>
  );
});

const DevicesSections = memo(function DevicesSections() {
  const { t } = useTranslation();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [signingOutDevices, setSigningOutDevices] = useState<Set<number>>(
    new Set(),
  );

  const {
    safeData: devices,
    isLoading,
    refetch,
  } = useFetch<DeviceType[]>("accounts/device/");

  const formatLastLogin = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  const handleDeviceClick = useCallback((id: number) => {
    setSelectedDeviceId(id);
  }, []);

  const handleSignOut = useCallback(
    async (deviceId: number, e: React.MouseEvent) => {
      e.stopPropagation();

      if (signingOutDevices.has(deviceId)) return;

      setSigningOutDevices((prev) => new Set(prev).add(deviceId));

      try {
        const { status } = await useCrud.delete(`accounts/device/${deviceId}/`);
        if (status === 204) {
          notify.success(t("devices.signout_success"));
          await refetch();
        } else {
          notify.error(t("devices.signout_fail"));
        }
      } catch (error) {
        console.error("Error during sign-out:", error);
        notify.error(t("devices.signout_error"));
      } finally {
        setSigningOutDevices((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deviceId);
          return newSet;
        });
      }
    },
    [refetch, signingOutDevices, t],
  );

  const deviceStats = useMemo(() => {
    const activeCount = devices.filter((device) => device.is_active).length;
    const totalCount = devices.length;
    return { activeCount, totalCount };
  }, [devices]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-semibold">
                {t("devices.title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("devices.loading")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-semibold">
                {t("devices.title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("devices.no_devices_title")}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t("devices.no_devices_desc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-lg font-semibold">
              {t("devices.title")}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t("devices.description")}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {t("devices.active_count", {
              active: deviceStats.activeCount,
              total: deviceStats.totalCount,
            })}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {t("devices.active_sessions")}
        </Label>
        <div className="grid gap-4">
          {devices.map((device) => (
            <DeviceItem
              key={device.id}
              device={device}
              isSelected={selectedDeviceId === device.id}
              onDeviceClick={handleDeviceClick}
              onSignOut={handleSignOut}
              formatLastLogin={formatLastLogin}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default DevicesSections;
