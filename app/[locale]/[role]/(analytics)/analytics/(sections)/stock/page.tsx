"use client";

import React, { useMemo } from "react";
import { useStore } from "@/stores/store.store";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "../../_components/KPICard";
import { LineSpark } from "../../_components/LineSpark";
import { fmt, toNum } from "../../_lib/format";
import useFetch from "@/hooks/use-fetch";

const ENDPOINT = "stock"; // muqobil: "inventory", "warehouse/stock", ...

type DecimalLike = number | string;
type Point = {
    date: string;
    stock_qty?: number;
    stock_value_usd?: DecimalLike;
    loss_usd?: DecimalLike;
};
type Res = { series: Point[] };

export default function StockPage() {
    const { selectedShop } = useStore();
    const sp = useSearchParams();
    const qs = sp.toString();

    const url = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams(qs);
        if (!q.has("period") && !q.has("date_from")) q.set("period", "monthly");
        if (!q.has("granularity")) q.set("granularity", "day");
        return `${selectedShop.id}/analytics/${ENDPOINT}/series/?${q.toString()}`;
    }, [selectedShop?.id, qs]);

    const { data, isLoading: loading, isError } = useFetch<Res>(url);
    const err = isError ? "Request failed" : null;
    const points = data?.series || [];

    const totalQty = points.reduce((a, p) => a + (p.stock_qty ?? 0), 0);
    const totalValue = points.reduce((a, p) => a + toNum(p.stock_value_usd ?? 0), 0);
    const totalLoss = points.reduce((a, p) => a + toNum(p.loss_usd ?? 0), 0);

    // oxirgi holat
    const lastValue = points.length ? toNum(points[points.length - 1].stock_value_usd ?? 0) : 0;

    return (
        <>
            {err ? <Card className="mb-4"><CardContent className="pt-6 text-red-600 text-sm">Xatolik: {err}</CardContent></Card> : null}

            <div className="grid gap-3 mb-6 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
                <KPICard title="Total Qty" value={totalQty} loading={loading} />
                <KPICard title="Total Value (USD)" value={fmt(totalValue)} loading={loading} />
                <KPICard title="Loss (USD)" value={fmt(totalLoss)} loading={loading} />
                <KPICard title="Last Value (USD)" value={fmt(lastValue)} loading={loading} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 grid-cols-1">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Stock value trend</CardTitle></CardHeader>
                    <CardContent>{loading ? <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Yuklanmoqda…</div> : <LineSpark points={points} getY={(p)=>toNum(p.stock_value_usd ?? 0)} yLabel="USD" />}</CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Loss trend</CardTitle></CardHeader>
                    <CardContent>{loading ? <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Yuklanmoqda…</div> : <LineSpark points={points} getY={(p)=>toNum(p.loss_usd ?? 0)} yLabel="USD" />}</CardContent>
                </Card>
            </div>
        </>
    );
}
