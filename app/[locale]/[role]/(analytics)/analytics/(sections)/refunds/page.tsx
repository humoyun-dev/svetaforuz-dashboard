"use client";

import React, { useMemo } from "react";
import { useStore } from "@/stores/store.store";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "../../_components/KPICard";
import { LineSpark } from "../../_components/LineSpark";
import { fmt, toNum } from "../../_lib/format";
import useFetch from "@/hooks/use-fetch";

const ENDPOINT = "refunds"; // muqobil: "returns"

type DecimalLike = number | string;
type Point = { date: string; refund_count?: number; refund_usd?: DecimalLike };
type Res = { series: Point[] };

export default function RefundsPage() {
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
    const totalRefunds = points.reduce((a, p) => a + (p.refund_count ?? 0), 0);
    const totalRefundUsd = points.reduce((a, p) => a + toNum(p.refund_usd ?? 0), 0);

    return (
        <>
            {err ? <Card className="mb-4"><CardContent className="pt-6 text-red-600 text-sm">Xatolik: {err}</CardContent></Card> : null}

            <div className="grid gap-3 mb-6 sm:grid-cols-2 grid-cols-1">
                <KPICard title="Refund count" value={totalRefunds} loading={loading} />
                <KPICard title="Refund amount (USD)" value={fmt(totalRefundUsd)} loading={loading} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 grid-cols-1">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Refund count trend</CardTitle></CardHeader>
                    <CardContent>{loading ? <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Yuklanmoqda…</div> : <LineSpark points={points} getY={(p)=>p.refund_count ?? 0} yLabel="count" />}</CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Refund amount trend</CardTitle></CardHeader>
                    <CardContent>{loading ? <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Yuklanmoqda…</div> : <LineSpark points={points} getY={(p)=>toNum(p.refund_usd ?? 0)} yLabel="USD" />}</CardContent>
                </Card>
            </div>
        </>
    );
}
