"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/stores/store.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import PeriodControls from "../../_components/PeriodControls";
import KPICard from "../../_components/KPICard";
import { fmt, toNum } from "../../_lib/format";
import useFetch from "@/hooks/use-fetch";

/** Backend endpoint */
const DEBTS_SUMMARY_ENDPOINT = "analytics/debts/summary/";

/** API type (backendga mos) */
type DebtsSummary = {
    store_id: number;
    period: { from: string; to: string };
    debts_source?: "auto" | string;

    debt_given_usd?: number | string | null;               // berilgan qarz
    debt_taken_usd?: number | string | null;               // olingan qarz
    receivables_outstanding_usd?: number | string | null;  // debitorlik qoldig‘i
    payables_outstanding_usd?: number | string | null;     // kreditorlik qoldig‘i

    debt_profit_usd?: number | string | null;              // qarzli hujjatlardan foyda
    receivables_profit_usd?: number | string | null;       // debitordan foyda
};

export default function DebtsPage() {
    const { selectedShop } = useStore();
    const sp = useSearchParams();

    const period = sp.get("period") || "monthly";
    const dateFrom = sp.get("date_from") || "";
    const dateTo = sp.get("date_to") || "";

    // URL (summary custom range yoki period qabul qiladi)
    const url = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams();
        if (period === "custom") {
            if (dateFrom) q.set("date_from", dateFrom);
            if (dateTo) q.set("date_to", dateTo);
        } else {
            q.set("period", period);
        }
        return `${selectedShop.id}/${DEBTS_SUMMARY_ENDPOINT}?${q.toString()}`;
    }, [selectedShop?.id, period, dateFrom, dateTo]);

    const { data, isLoading, isError, refetch } = useFetch<DebtsSummary>(url);

    // KPI qiymatlar (toNum bilan xavfsiz)
    const debtGiven = toNum(data?.debt_given_usd ?? 0);
    const debtTaken = toNum(data?.debt_taken_usd ?? 0);
    const recvOutstanding = toNum(data?.receivables_outstanding_usd ?? 0);
    const payOutstanding = toNum(data?.payables_outstanding_usd ?? 0);
    const debtProfit = toNum(data?.debt_profit_usd ?? 0);
    const recvProfit = toNum(data?.receivables_profit_usd ?? 0);

    // Foydali ko‘rsatkich: sof oqim (olingan − berilgan)
    const netFlow = debtTaken - debtGiven;

    return (
        <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <PeriodControls />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={!url || isLoading}
                >
                    Yangilash
                </Button>
            </div>

            {/* davr ma’lumoti */}
            {data?.period && (
                <Card className="mb-3">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm">Qarzlar — umumiy ko‘rinish</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Davr: {data.period.from?.slice(0, 10)} — {data.period.to?.slice(0, 10)}
                    </CardContent>
                </Card>
            )}

            {isError && (
                <Card className="mb-4">
                    <CardContent className="pt-6 text-red-600 text-sm">
                        Xatolik: qarzlar bo‘yicha umumiy ma’lumotlarni yuklab bo‘lmadi.
                    </CardContent>
                </Card>
            )}

            {/* 1-qator KPI’lar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Berilgan qarz (USD)" value={fmt(debtGiven)} loading={isLoading} />
                <KPICard title="Olingan qarz (USD)" value={fmt(debtTaken)} loading={isLoading} />
                <KPICard title="Debitorlik (qoldiq) (USD)" value={fmt(recvOutstanding)} loading={isLoading} />
                <KPICard title="Kreditorlik (qoldiq) (USD)" value={fmt(payOutstanding)} loading={isLoading} />
            </div>

            {/* 2-qator KPI’lar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <KPICard title="Qarzdan foyda (USD)" value={fmt(debtProfit)} loading={isLoading} />
                <KPICard title="Debitordan foyda (USD)" value={fmt(recvProfit)} loading={isLoading} />
                <KPICard title="Sof oqim (olingan − berilgan)" value={fmt(netFlow)} loading={isLoading} />
            </div>

            {/* Izohlar/Sana oralig‘i */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Izoh</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Ushbu sahifa <code>{DEBTS_SUMMARY_ENDPOINT}</code> endpointidan olingan qiymatlarga tayangan.
                    Agar kelajakda trend (grafik) kerak bo‘lsa, backendda mos series endpoint qo‘shilgach,
                    shu yerga chizma qo‘shish oson.
                </CardContent>
            </Card>
        </>
    );
}
