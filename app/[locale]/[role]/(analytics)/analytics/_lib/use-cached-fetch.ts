"use client";

import { useEffect, useState } from "react";

// 15s in-memory cache
const _cache = new Map<string, { ts: number; data: any }>();
const TTL = 15_000;

// Token va CSRF ni topib, headerga qo'shamiz
function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { Accept: "application/json" };

    try {
        // loyihaga mos kelishi uchun bir nechta kalitni tekshiramiz
        const token =
            (typeof window !== "undefined" && (
                localStorage.getItem("access") ||
                localStorage.getItem("access_token") ||
                localStorage.getItem("token")
            )) || "";

        if (token) {
            headers.Authorization = token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`;
        }
    } catch {
        // localStorage mavjud bo'lmasligi mumkin (SSR)
    }

    // Agar Django session ishlatsa va CSRF cookie bo'lsa — qo'shib yuboramiz
    if (typeof document !== "undefined") {
        const m =
            document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/) ||
            document.cookie.match(/(?:^|;\s*)csrf=([^;]+)/);
        if (m?.[1]) headers["X-CSRFToken"] = m[1];
    }

    return headers;
}

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
    const now = Date.now();
    const c = _cache.get(url);
    if (c && now - c.ts < TTL) return c.data as T;

    const res = await fetch(url, {
        signal,
        credentials: "include",          // cookie/session kerak bo'lsa
        headers: getAuthHeaders(),        // JWT/CSRF bo'lsa ham qamrab oladi
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        // xatoni aniqroq ko'rish uchun qisqa matn ham qo'shamiz
        throw new Error(`HTTP ${res.status}${text ? ` — ${text.slice(0, 140)}` : ""}`);
    }

    const data = (await res.json()) as T;
    _cache.set(url, { ts: now, data });
    return data;
}

export function useCachedFetch<T>(url: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;
        const ctl = new AbortController();
        setLoading(true);
        setErr(null);

        getJSON<T>(url, ctl.signal)
            .then(setData)
            .catch((e) => {
                if ((e as any)?.name !== "AbortError") setErr((e as Error).message || "Error");
            })
            .finally(() => setLoading(false));

        return () => ctl.abort();
    }, [url]);

    return { data, loading, err, refetch: () => url && _cache.delete(url) };
}
