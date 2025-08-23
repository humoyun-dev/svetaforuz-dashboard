"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";

import PeriodControls from "./_components/PeriodControls";
import KPICard from "./_components/KPICard";
import { fmt } from "./_lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProfitRes = {
    store_id: number;
    period: { from: string; to: string };
    turnover_mode?: string | null;
    outflow_mode?: string | null;
    debts_source?: string | null;
    imports_mode?: string | null;

    turnover_usd: number;
    gross_profit_usd: number;
    operating_expenses_usd: number;
    salaries_usd: number;
    total_outflows_usd: number;
    net_profit_usd: number;

    debt_given_usd: number;
    debt_taken_usd: number;
    receivables_outstanding_usd: number;
    payables_outstanding_usd: number;
    debt_profit_usd: number;
    receivables_profit_usd: number;

    imports_quantity: number;
    imports_value_usd: number;
};

const ENDPOINT = "analytics/store/profit/";

export default function OverviewPage() {
    const { selectedShop } = useStore();
    const sp = useSearchParams();

    const period = sp.get("period") || "monthly";
    const dateFrom = sp.get("date_from") || "";
    const dateTo = sp.get("date_to") || "";

    const url = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams();
        if (period === "custom") {
            if (dateFrom) q.set("date_from", dateFrom);
            if (dateTo) q.set("date_to", dateTo);
        } else {
            q.set("period", period);
        }
        return `${selectedShop.id}/${ENDPOINT}?${q.toString()}`;
    }, [selectedShop?.id, period, dateFrom, dateTo]);

    const { data, isLoading, isError, refetch } = useFetch<ProfitRes>(url);

    const p = data;

    return (
        <>
            {/* bosh panel: davr + yangilash */}
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

            {/* xatolik */}
            {isError && (
                <Card className="mb-4">
                    <CardContent className="pt-6 text-red-600 text-sm">
                        Xatolik: do‘kon foydasi bo‘yicha ma’lumotlar yuklanmadi.
                    </CardContent>
                </Card>
            )}

            {/* davr ma’lumoti */}
            {p?.period && (
                <Card className="mb-4">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm">Do‘kon foydasi — umumiy ko‘rinish</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Davr: {p.period.from?.slice(0, 10)} — {p.period.to?.slice(0, 10)}
                    </CardContent>
                </Card>
            )}

            {/* Asosiy KPI’lar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                <KPICard title="Aylanma (USD)" value={fmt(p?.turnover_usd || 0)} loading={isLoading} />
                <KPICard title="Yalpi foyda (USD)" value={fmt(p?.gross_profit_usd || 0)} loading={isLoading} />
                <KPICard title="Operatsion xarajatlar (USD)" value={fmt(p?.operating_expenses_usd || 0)} loading={isLoading} />
                <KPICard title="Ish haqi (USD)" value={fmt(p?.salaries_usd || 0)} loading={isLoading} />
                <KPICard title="Jami chiqimlar (USD)" value={fmt(p?.total_outflows_usd || 0)} loading={isLoading} />
                <KPICard title="Sof foyda (USD)" value={fmt(p?.net_profit_usd || 0)} loading={isLoading} />
            </div>

            {/* Qarz / Debitor-Kreditor KPI’lar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                <KPICard title="Berilgan qarz (USD)" value={fmt(p?.debt_given_usd || 0)} loading={isLoading} />
                <KPICard title="Olingan qarz (USD)" value={fmt(p?.debt_taken_usd || 0)} loading={isLoading} />
                <KPICard title="Debitorlik (qoldiq) (USD)" value={fmt(p?.receivables_outstanding_usd || 0)} loading={isLoading} />
                <KPICard title="Kreditorlik (qoldiq) (USD)" value={fmt(p?.payables_outstanding_usd || 0)} loading={isLoading} />
                <KPICard title="Qarzdan foyda (USD)" value={fmt(p?.debt_profit_usd || 0)} loading={isLoading} />
                <KPICard title="Debitordan foyda (USD)" value={fmt(p?.receivables_profit_usd || 0)} loading={isLoading} />
            </div>

            {/* Importlar */}
            <div className="grid gap-3 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                <KPICard title="Import miqdori" value={fmt(p?.imports_quantity || 0)} loading={isLoading} />
                <KPICard title="Import qiymati (USD)" value={fmt(p?.imports_value_usd || 0)} loading={isLoading} />
            </div>

            {/* Rejimlar / sozlamalar */}
            {p && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hisoblash rejimlari</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Aylanma rejimi:</span>{" "}
                            {p.turnover_mode ?? "—"}
                        </div>
                        <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Chiqimlar rejimi:</span>{" "}
                            {p.outflow_mode ?? "—"}
                        </div>
                        <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Qarzlar manbai:</span>{" "}
                            {p.debts_source ?? "—"}
                        </div>
                        <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Import rejimi:</span>{" "}
                            {p.imports_mode ?? "—"}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
