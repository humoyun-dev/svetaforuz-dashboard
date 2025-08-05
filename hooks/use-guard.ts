"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie, setSecureCookie } from "@/lib/cookie";
import type { StaffType } from "@/types/user.type";
import { useStore } from "@/stores/store.store";
import { handleCheckToken } from "@/checker/token";
import axios from "axios";
import { useHydrationReady } from "@/hooks/use-hydration";
import { useUserStore } from "@/stores/user.store";

const STAFF_PATHS: StaffType[] = [
  "admin",
  "manager",
  "seller",
  "deliverer",
  "cashier",
  "stockman",
  "viewer",
];

export function useGuard() {
  useTokenGuard();
  useRoleGuard();
}

export function useTokenGuard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      console.warn("Offline mode: skipping token validation.");
      return;
    }

    (async () => {
      const valid = await handleCheckToken();
      if (!valid) router.replace("/auth/login");
    })();
  }, []);
}

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedShop = useStore((s) => s.selectedShop);
  const token = getCookie("access_token");
  const pathCookie = getCookie("path");

  const { setRole } = useUserStore();

  const hydrated = useHydrationReady();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!hydrated || hasRunRef.current) return;
    hasRunRef.current = true;

    if (!selectedShop) {
      router.replace("/select");
      return;
    }

    const selectedRole = selectedShop.role;
    const urlSegments = pathname.split("/");
    const isI18n = ["uz", "en", "ru"].includes(urlSegments[1]);
    const roleIndex = isI18n ? 2 : 1;
    const roleSegment = urlSegments[roleIndex];

    if (pathCookie !== selectedRole) {
      setSecureCookie("path", selectedRole);
    }
    setRole(selectedRole);

    if (roleSegment !== selectedRole) {
      urlSegments[roleIndex] = selectedRole;
      const correctedUrl = urlSegments.join("/");
      router.replace(
        correctedUrl.startsWith("/") ? correctedUrl : "/" + correctedUrl,
      );
      return;
    }

    if (typeof window !== "undefined" && navigator.onLine) {
      const verify = async () => {
        try {
          const url = `${process.env.NEXT_PUBLIC_SERVER_URL}store/${selectedShop.id}/access/`;
          const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!data.has_access || data.role !== selectedRole) {
            router.replace("/select");
          }
        } catch (err) {
          router.replace("/select");
        }
      };

      verify();
    } else {
      console.warn("Offline mode: skipping store access verification.");
    }
  }, [pathname, selectedShop, hydrated]);
}
