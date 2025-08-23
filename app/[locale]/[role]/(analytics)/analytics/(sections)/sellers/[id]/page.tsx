"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";

import PeriodControls from "../../../_components/PeriodControls";
import KPICard from "../../../_components/KPICard";
import { fmt, toNum } from "../../../_lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SellerSummary = {
    store_id: number;
    period: { from: string; to: string };
    seller_id: string | number;
    seller_label?: string;
    orders_count: number;
    products_sold: number;
    revenue_usd: number | string;
    profit_usd: number | string;
    unpaid_sum_usd: number | string;
    avg_check_usd?: number | string | null;
};

export default function SellerDetailPage() {
    const { selectedShop } = useStore();
    const { id, locale, role } = useParams<{ id: string; locale: string; role: string }>();
    const sp = useSearchParams();

    const period = sp.get("period") || "monthly";
    const dateFrom = sp.get("date_from") || "";
    const dateTo = sp.get("date_to") || "";

    const url = useMemo(() => {
        if (!selectedShop?.id || !id) return "";
        const q = new URLSearchParams();
        if (period === "custom") {
            if (dateFrom) q.set("date_from", dateFrom);
            if (dateTo) q.set("date_to", dateTo);
        } else {
            q.set("period", period);
        }
        return `${selectedShop.id}/analytics/sellers/${id}/summary/?${q.toString()}`;
    }, [selectedShop?.id, id, period, dateFrom, dateTo]);

    const { data, isLoading, isError, refetch } = useFetch<SellerSummary>(url);

    const orders = toNum(data?.orders_count ?? 0);
    const products = toNum(data?.products_sold ?? 0);
    const revenue = toNum(data?.revenue_usd ?? 0);
    const profit = toNum(data?.profit_usd ?? 0);
    const unpaid = toNum(data?.unpaid_sum_usd ?? 0);
    const avgCheck =
        data?.avg_check_usd != null
            ? toNum(data.avg_check_usd)
            : orders ? revenue / orders : 0;

    const backHref = `/${locale}/${role}/analytics/sellers`;

    return (
        <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <Link href={backHref} className="text-sm text-muted-foreground underline underline-offset-2">
                    ← Sotuvchilarga qaytish
                </Link>
                <PeriodControls />
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={!url || isLoading}>
                    Yangilash
                </Button>
            </div>

            {isError && (
                <Card className="mb-4">
                    <CardContent className="pt-6 text-red-600 text-sm">
                        Xatolik: sotuvchi bo‘yicha umumiy ma’lumotlarni yuklab bo‘lmadi.
                    </CardContent>
                </Card>
            )}

            <Card className="mb-4">
                <CardHeader className="pb-1">
                    <CardTitle className="text-sm">
                        Sotuvchi: {data?.seller_label || `#${data?.seller_id ?? id}`}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                    Davr: {data?.period?.from?.slice(0, 10)} — {data?.period?.to?.slice(0, 10)}
                </CardContent>
            </Card>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                <KPICard title="Buyurtmalar" value={fmt(orders)} loading={isLoading} />
                <KPICard title="Sotilgan mahsulotlar" value={fmt(products)} loading={isLoading} />
                <KPICard title="Tushum (USD)" value={fmt(revenue)} loading={isLoading} />
                <KPICard title="Foyda (USD)" value={fmt(profit)} loading={isLoading} />
                <KPICard title="O‘rtacha chek (USD)" value={fmt(avgCheck)} loading={isLoading} />
                <KPICard title="To‘lanmagan (USD)" value={fmt(unpaid)} loading={isLoading} />
            </div>
        </>
    );
}
