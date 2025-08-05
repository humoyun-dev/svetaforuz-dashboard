"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import { getCookie } from "@/lib/cookie";
import { useDeviceStore } from "@/stores/device.store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setDevice = useDeviceStore((state) => state.setDevice);

  useEffect(() => {
    const refresh = getCookie("refresh_token");
    const path = getCookie("path");
    const changeAccount = searchParams.get("changeaccount");

    if (refresh && !changeAccount) {
      if (path) {
        router.push(`/${path}`);
      } else {
        router.push(`/`);
      }
    }
  }, [router, searchParams]);

  useEffect(() => {
    axios
      .get("/api/device")
      .then((res) => setDevice(res.data))
      .catch((err) => console.error("Device detection failed:", err));
  }, [setDevice]);

  return (
    <div className="flex bg-gradient-to-br dark:from-indigo-900 from-indigo-400 from-10% dark:via-sky-900 via-sky-400 via-30% dark:to-emerald-900 to-emerald-400 to-90% h-screen w-full flex-col items-center justify-center antialiased">
      <div className="z-10 w-full">{children}</div>
    </div>
  );
}
