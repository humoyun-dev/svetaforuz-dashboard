"use client";

import React, { useMemo } from "react";
import {
    useSearchParams,
    useRouter,
    usePathname,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";

// ⬇️ Eʼtibor: sales papkasi analytics ichida, shuning uchun
// _components va _lib importlari .. bilan boshlanadi
import PeriodControls from "../_components/PeriodControls";
import KPICard from "../_components/KPICard";
import TrendChart from "../_components/TrendChart";
import { fmt, toNum } from "../_lib/format";
import {
    defaultGranularity,
    normalizeGranularity,
    type Granularity,
} from "../_lib/granularity";

// ---------- API typelar ----------
type SeriesPoint = {
    date: string;
    orders_count?: number;
    revenue_usd?: number | string | null;
    profit_usd?: number | string | null;
    inflow_usd?: number | string | null;
    unpaid_sum_usd?: number | string | null;
};
type SeriesRes = { series: SeriesPoint[] };

type TopProduct = {
    product_id: number;
    product_name: string;
    quantity: number;
    revenue_usd: number | string;
    profit_usd: number | string;
    avg_unit_price_usd: number | string;
};
type ProductsRes = {
    by: "quantity" | "revenue" | "profit";
    limit: number;
    products: TopProduct[];
};

// ---------------------------------

export default function SalesPage() {
    const { selectedShop } = useStore();

    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const period = (sp.get("period") as string) || "monthly";
    const granularity = normalizeGranularity(
        period,
        (sp.get("granularity") as Granularity) || defaultGranularity(period)
    );

    const by = (sp.get("by") as "quantity" | "revenue" | "profit") || "quantity";
    const limit = Number(sp.get("limit") || 10);
    const from = sp.get("date_from") || "";
    const to = sp.get("date_to") || "";

    // query patcher (PeriodControls bilan bir xil uslub)
    const setQuery = (patch: Partial<Record<string, string>>) => {
        const q = new URLSearchParams(sp.toString());
        Object.entries(patch).forEach(([k, v]) => {
            if (v === undefined || v === null || v === "") q.delete(k);
            else q.set(k, v);
        });
        const p = (q.get("period") as string) || "monthly";
        q.set(
            "granularity",
            normalizeGranularity(p, (q.get("granularity") as any) || defaultGranularity(p))
        );
        if (p !== "custom") {
            q.delete("date_from");
            q.delete("date_to");
        }
        router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    };

    // --------- URL lar
    const seriesUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams();
        // period vs custom
        if (period === "custom") {
            if (from) q.set("date_from", from);
            if (to) q.set("date_to", to);
        } else {
            q.set("period", period);
        }
        q.set("granularity", granularity);
        // RELATIVE URL — useFetch auth headerlarni qo‘shadi
        return `${selectedShop.id}/analytics/orders/series/?${q.toString()}`;
    }, [selectedShop?.id, period, granularity, from, to]);

    const productsUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams();
        if (period === "custom") {
            if (from) q.set("date_from", from);
            if (to) q.set("date_to", to);
        } else {
            q.set("period", period);
        }
        q.set("by", by);
        q.set("limit", String(limit));
        return `${selectedShop.id}/analytics/orders/products/?${q.toString()}`;
    }, [selectedShop?.id, period, by, limit, from, to]);

    // --------- fetchlar
    const {
        data: seriesData,
        isLoading: seriesLoading,
        isError: seriesError,
        refetch: refetchSeries,
    } = useFetch<SeriesRes>(seriesUrl);

    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
        refetch: refetchProducts,
    } = useFetch<ProductsRes>(productsUrl);

    // --------- KPI lar
    const points = seriesData?.series ?? [];
    const totals = useMemo(
        () =>
            points.reduce(
                (acc, p) => {
                    acc.orders += p.orders_count ?? 0;
                    acc.revenue += toNum(p.revenue_usd);
                    acc.profit += toNum(p.profit_usd);
                    acc.inflow += toNum(p.inflow_usd);
                    acc.unpaid += toNum(p.unpaid_sum_usd);
                    return acc;
                },
                { orders: 0, revenue: 0, profit: 0, inflow: 0, unpaid: 0 }
            ),
        [points]
    );

    const topProducts = productsData?.products ?? [];

    // Uzbekcha yorliqlar
    const byUz = {
        quantity: "soni",
        revenue: "tushum",
        profit: "foyda",
    } as const;

    // UI: selectors (by / limit)
    const Selector = (
        <div className="flex items-center gap-2">
            <select
                className="h-8 rounded-md border px-2 text-sm"
                value={by}
                onChange={(e) => setQuery({ by: e.target.value })}
            >
                <option value="quantity">Soni bo‘yicha</option>
                <option value="revenue">Tushum bo‘yicha</option>
                <option value="profit">Foyda bo‘yicha</option>
            </select>
            <select
                className="h-8 rounded-md border px-2 text-sm"
                value={String(limit)}
                onChange={(e) => setQuery({ limit: e.target.value })}
            >
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
            </select>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    refetchSeries();
                    refetchProducts();
                }}
                disabled={!seriesUrl || !productsUrl || seriesLoading || productsLoading}
            >
                Yangilash
            </Button>
        </div>
    );

    return (
        <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <PeriodControls />
                {Selector}
            </div>

            {(seriesError || productsError) && (
                <Card className="mb-4">
                    <CardContent className="pt-6 text-red-600 text-sm space-y-1">
                        {seriesError ? <div>Vaqt qatori: so‘rovda xatolik.</div> : null}
                        {productsError ? <div>Top mahsulotlar: so‘rovda xatolik.</div> : null}
                    </CardContent>
                </Card>
            )}

            {/* KPI lar */}
            <div className="grid gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-5 grid-cols-1">
                <KPICard title="Buyurtmalar" value={fmt(totals.orders)} loading={seriesLoading} />
                <KPICard title="Tushum (USD)" value={fmt(totals.revenue)} loading={seriesLoading} />
                <KPICard title="Foyda (USD)" value={fmt(totals.profit)} loading={seriesLoading} />
                <KPICard title="Kirim (USD)" value={fmt(totals.inflow)} loading={seriesLoading} />
                <KPICard title="To‘lanmagan (USD)" value={fmt(totals.unpaid)} loading={seriesLoading} />
            </div>

            {/* Trend — Revenue & Profit bir grafikda */}
            <Card className="mb-3">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tushum va foyda dinamikasi</CardTitle>
                </CardHeader>
                <CardContent>
                    {seriesLoading ? (
                        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                            Yuklanmoqda…
                        </div>
                    ) : points.length ? (
                        <TrendChart<SeriesPoint>
                            data={points}
                            yLabel="USD"
                            series={[
                                { name: "Tushum", dataKey: (p) => toNum(p.revenue_usd), color: "#2563eb" },
                                { name: "Foyda", dataKey: (p) => toNum(p.profit_usd), color: "#16a34a" },
                            ]}
                            valueFormatter={(n) =>
                                Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)
                            }
                        />
                    ) : (
                        <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
                            Ma’lumot yo‘q
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Top products */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                        Top mahsulotlar ({byUz[by]}) — {limit}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {productsLoading ? (
                        <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground">
                            Yuklanmoqda…
                        </div>
                    ) : topProducts.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground">
                                <tr className="text-left">
                                    <th className="py-2 pr-3">Mahsulot</th>
                                    <th className="py-2 pr-3">Soni</th>
                                    <th className="py-2 pr-3">O‘rtacha narx</th>
                                    <th className="py-2 pr-3">Tushum</th>
                                    <th className="py-2 pr-0">Foyda</th>
                                </tr>
                                </thead>
                                <tbody>
                                {topProducts.map((p) => (
                                    <tr key={p.product_id} className="border-t">
                                        <td className="py-2 pr-3">{p.product_name}</td>
                                        <td className="py-2 pr-3">{fmt(p.quantity)}</td>
                                        <td className="py-2 pr-3">{fmt(toNum(p.avg_unit_price_usd))}</td>
                                        <td className="py-2 pr-3">{fmt(toNum(p.revenue_usd))}</td>
                                        <td className="py-2 pr-0">{fmt(toNum(p.profit_usd))}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground">
                            Ma’lumot yo‘q
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
