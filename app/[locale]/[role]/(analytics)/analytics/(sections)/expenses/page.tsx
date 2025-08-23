"use client";

import React, { useMemo } from "react";
import { useStore } from "@/stores/store.store";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "../../_components/KPICard";
import { LineSpark } from "../../_components/LineSpark";
import { fmt, toNum } from "../../_lib/format";
import useFetch from "@/hooks/use-fetch";

const ENDPOINT = "expenses"; // kerak bo'lsa moslashtir: "expense", "analytics/expenses", ...

type DecimalLike = number | string;
type Point = { date: string; expense_usd?: DecimalLike };
type Res = { series: Point[] };

export default function ExpensesPage() {
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
    const totalExpense = points.reduce((a, p) => a + toNum(p.expense_usd ?? 0), 0);

    return (
        <>
            {err ? <Card className="mb-4"><CardContent className="pt-6 text-red-600 text-sm">Xatolik: {err}</CardContent></Card> : null}

            <div className="grid gap-3 mb-6 sm:grid-cols-2 grid-cols-1">
                <KPICard title="Total Expense (USD)" value={fmt(totalExpense)} loading={loading} />
                <KPICard title="Avg per point (USD)" value={fmt(points.length ? totalExpense / points.length : 0)} loading={loading} />
            </div>

            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Expense trend</CardTitle></CardHeader>
                <CardContent>{loading ? <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Yuklanmoqda…</div> : <LineSpark points={points} getY={(p)=>toNum(p.expense_usd ?? 0)} yLabel="USD" />}</CardContent>
            </Card>
        </>
    );
}
