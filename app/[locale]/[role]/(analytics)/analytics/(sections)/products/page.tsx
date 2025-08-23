"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/stores/store.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import PeriodControls from "../../_components/PeriodControls";
import KPICard from "../../_components/KPICard";
import TrendChart from "../../_components/TrendChart";
import { fmt, toNum } from "../../_lib/format";
import {
    defaultGranularity,
    normalizeGranularity,
    type Granularity,
} from "../../_lib/granularity";
import useFetch from "@/hooks/use-fetch";

/* --------- API endpoint’lar --------- */
const SUMMARY_ENDPOINT = "analytics/products/summary/";
const IMPORTS_ENDPOINT = "analytics/products/imports/";
const TOP_ENDPOINT = "analytics/products/top/";
// trend uchun orders seriyasidan foydalanamiz
const ORDERS_SERIES_ENDPOINT = "analytics/orders/series/";

/* --------- Types (backendga mos) --------- */
type SummaryRes = {
    store_id: number;
    period: { from: string; to: string };
    products_total_objects?: number;
    products_total_qty?: number;
    warehouse_product_types?: number;
    warehouse_total_qty?: number;
    top_profit_product?: {
        product_id?: number;
        product_name?: string;
        quantity?: number;
        profit_usd?: number | string;
    } | null;
    top_sold_product?: {
        product_id?: number;
        product_name?: string;
        quantity?: number;
        profit_usd?: number | string;
    } | null;
};

type ImportsRes = {
    store_id: number;
    period: { from: string; to: string };
    imports_mode?: string; // "pure" ...
    imports_quantity?: number;
    imports_value_usd?: number | string;
};

type TopItem = {
    product_id?: number;
    product_name?: string;
    quantity?: number;
    profit_usd?: number | string;
};
type TopRes = {
    store_id: number;
    period: { from: string; to: string };
    by: "profit" | "quantity";
    limit: number;
    products: TopItem[];
};

type SeriesPoint = { date: string; revenue_usd?: number | string };
type SeriesRes = { series: SeriesPoint[] } | SeriesPoint[];
type SeriesRow = { date: string; revenue: number };

/* ========================================= */

export default function ProductsPage() {
    const { selectedShop } = useStore();
    const sp = useSearchParams();

    const period = sp.get("period") || "monthly";
    const granularity = normalizeGranularity(
        period,
        (sp.get("granularity") as Granularity) || defaultGranularity(period),
    );
    const dateFrom = sp.get("date_from") || "";
    const dateTo = sp.get("date_to") || "";

    // Top N boshqaruvlari
    const [topBy, setTopBy] = useState<"profit" | "quantity">("profit");
    const [topLimit, setTopLimit] = useState<number>(10);

    /* ---------- URL helpers ---------- */
    const buildQuery = (forSeries = false) => {
        const q = new URLSearchParams();
        if (forSeries) {
            q.set("granularity", granularity);
            if (period === "custom") {
                if (dateFrom) q.set("date_from", dateFrom);
                if (dateTo) q.set("date_to", dateTo);
            } else {
                q.set("period", period);
            }
            return q;
        }
        // summary/imports/top — odatda period yoki custom range
        if (period === "custom") {
            if (dateFrom) q.set("date_from", dateFrom);
            if (dateTo) q.set("date_to", dateTo);
        } else {
            q.set("period", period);
        }
        return q;
    };

    /* ---------- URL’lar ---------- */
    const summaryUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        return `${selectedShop.id}/${SUMMARY_ENDPOINT}?${buildQuery().toString()}`;
    }, [selectedShop?.id, period, dateFrom, dateTo]);

    const importsUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        return `${selectedShop.id}/${IMPORTS_ENDPOINT}?${buildQuery().toString()}`;
    }, [selectedShop?.id, period, dateFrom, dateTo]);

    const topUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = buildQuery();
        q.set("by", topBy);
        q.set("limit", String(topLimit));
        return `${selectedShop.id}/${TOP_ENDPOINT}?${q.toString()}`;
    }, [selectedShop?.id, period, dateFrom, dateTo, topBy, topLimit]);

    const seriesUrl = useMemo(() => {
        if (!selectedShop?.id) return "";
        return `${selectedShop.id}/${ORDERS_SERIES_ENDPOINT}?${buildQuery(true).toString()}`;
    }, [selectedShop?.id, period, granularity, dateFrom, dateTo]);

    /* ---------- Fetch ---------- */
    const {
        data: summary,
        isLoading: summLoading,
        isError: summErr,
        refetch: refetchSummary,
    } = useFetch<SummaryRes>(summaryUrl);

    const {
        data: imports,
        isLoading: importsLoading,
        isError: importsErr,
        refetch: refetchImports,
    } = useFetch<ImportsRes>(importsUrl);

    const {
        data: top,
        isLoading: topLoading,
        isError: topErr,
        refetch: refetchTop,
    } = useFetch<TopRes>(topUrl);

    const {
        data: series,
        isLoading: seriesLoading,
        refetch: refetchSeries,
    } = useFetch<SeriesRes>(seriesUrl);

    /* ---------- Map series ---------- */
    const seriesRows: SeriesRow[] = useMemo(() => {
        const list = Array.isArray(series) ? series : (series?.series ?? []);
        return (list as SeriesPoint[]).map((p) => ({
            date: p.date,
            revenue: toNum(p.revenue_usd ?? 0),
        }));
    }, [series]);

    /* ---------- KPI values ---------- */
    const productsTotalObjects = summary?.products_total_objects ?? 0;
    const productsTotalQty = summary?.products_total_qty ?? 0;
    const warehouseProductTypes = summary?.warehouse_product_types ?? 0;
    const warehouseTotalQty = summary?.warehouse_total_qty ?? 0;

    const importsQty = toNum(imports?.imports_quantity ?? 0);
    const importsValue = toNum(imports?.imports_value_usd ?? 0);

    const topProfit = summary?.top_profit_product ?? null;
    const topSold = summary?.top_sold_product ?? null;

    const onRefreshAll = () => {
        refetchSummary();
        refetchImports();
        refetchTop();
        refetchSeries();
    };

    return (
        <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <PeriodControls />
                <Button variant="outline" size="sm" onClick={onRefreshAll}>
                    Yangilash
                </Button>
            </div>

            {/* Xatolik bannerlari */}
            {(summErr || importsErr || topErr) && (
                <Card className="mb-3">
                    <CardContent className="pt-6 text-red-600 text-sm">
                        {summErr && <div>Mahsulotlar bo‘yicha umumiy ma’lumotlarni yuklashda xatolik.</div>}
                        {importsErr && <div>Import ma’lumotlarini yuklashda xatolik.</div>}
                        {topErr && <div>Top mahsulotlar ro‘yxatini yuklashda xatolik.</div>}
                    </CardContent>
                </Card>
            )}

            {/* 1-qator KPI lar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Mahsulotlar (obyektlar)" value={fmt(productsTotalObjects)} loading={summLoading} />
                <KPICard title="Mahsulotlar soni (qty)" value={fmt(productsTotalQty)} loading={summLoading} />
                <KPICard title="Ombordagi turlar" value={fmt(warehouseProductTypes)} loading={summLoading} />
                <KPICard title="Ombordagi qty" value={fmt(warehouseTotalQty)} loading={summLoading} />
            </div>

            {/* 2-qator: Importlar + Englar */}
            <div className="grid gap-3 mb-6 grid-cols-1 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Importlar</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-muted-foreground">Miqdor</div>
                            <div className="text-xl font-semibold">
                                {importsLoading ? "…" : fmt(importsQty)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Qiymat (USD)</div>
                            <div className="text-xl font-semibold">
                                {importsLoading ? "…" : fmt(importsValue)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Eng foydali mahsulot</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!summary || summLoading ? (
                            <div className="text-sm text-muted-foreground">Yuklanmoqda…</div>
                        ) : topProfit ? (
                            <div className="space-y-1">
                                <div className="font-medium">{topProfit.product_name}</div>
                                <div className="text-xs text-muted-foreground">
                                    Foyda: {fmt(toNum(topProfit.profit_usd ?? 0))} · Soni: {fmt(toNum(topProfit.quantity ?? 0))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">Ma’lumot yo‘q</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Eng ko‘p sotilgan mahsulot</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!summary || summLoading ? (
                            <div className="text-sm text-muted-foreground">Yuklanmoqda…</div>
                        ) : topSold ? (
                            <div className="space-y-1">
                                <div className="font-medium">{topSold.product_name}</div>
                                <div className="text-xs text-muted-foreground">
                                    Soni: {fmt(toNum(topSold.quantity ?? 0))} · Foyda: {fmt(toNum(topSold.profit_usd ?? 0))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">Ma’lumot yo‘q</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top N mahsulotlar */}
            <Card className="mb-6">
                <CardHeader className="pb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-sm">Top mahsulotlar</CardTitle>
                    <div className="flex gap-2">
                        <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={topBy}
                            onChange={(e) => setTopBy(e.target.value as "profit" | "quantity")}
                        >
                            <option value="profit">Foyda</option>
                            <option value="quantity">Soni</option>
                        </select>
                        <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={topLimit}
                            onChange={(e) => setTopLimit(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={refetchTop} disabled={topLoading}>
                            Qayta yuklash
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {topLoading ? (
                        <div className="text-sm text-muted-foreground">Yuklanmoqda…</div>
                    ) : top && top.products?.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-muted-foreground">
                                <tr className="border-b">
                                    <th className="text-left py-2 pr-2">#</th>
                                    <th className="text-left py-2 pr-2">Mahsulot</th>
                                    <th className="text-right py-2 pr-2">Soni</th>
                                    <th className="text-right py-2 pr-2">Foyda (USD)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {top.products.map((p, i) => (
                                    <tr key={`${p.product_id}-${i}`} className="border-b last:border-0">
                                        <td className="py-2 pr-2">{i + 1}</td>
                                        <td className="py-2 pr-2">{p.product_name ?? "-"}</td>
                                        <td className="py-2 pr-2 text-right">{fmt(toNum(p.quantity ?? 0))}</td>
                                        <td className="py-2 pr-2 text-right">{fmt(toNum(p.profit_usd ?? 0))}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Ma’lumot yo‘q</div>
                    )}
                </CardContent>
            </Card>

            {/* Tushum dinamikasi (orders seriyasidan) */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tushum dinamikasi</CardTitle>
                </CardHeader>
                <CardContent>
                    {seriesLoading ? (
                        <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                            Yuklanmoqda…
                        </div>
                    ) : seriesRows.length ? (
                        <TrendChart<SeriesRow>
                            data={seriesRows}
                            yLabel="USD"
                            series={[{ name: "Tushum", dataKey: "revenue" }]}
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
        </>
    );
}
