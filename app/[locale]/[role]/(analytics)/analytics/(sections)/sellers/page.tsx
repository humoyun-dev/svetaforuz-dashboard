"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";

import PeriodControls from "../../_components/PeriodControls";
import { fmt, toNum } from "../../_lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SellerRow = {
    seller_id: number;
    seller_label: string;
    orders_count: number;
    customers_count: number;
    products_sold: number;
    revenue_usd: number | string;
    profit_usd: number | string;
    unpaid_sum_usd: number | string;
    avg_check_usd: number | string | null;
    commission_usd: number | string | null;
};

type SellersRes = {
    period: { from: string; to: string };
    order_by: "profit" | "revenue" | "orders";
    limit: number;
    sellers: SellerRow[];
};

const ENDPOINT = "analytics/sellers/summary/";

export default function SellersPage() {
    const { selectedShop } = useStore();
    const sp = useSearchParams();
    const { locale, role } = useParams() as { locale: string; role: string };

    const period = sp.get("period") || "monthly";
    const from = sp.get("date_from") || "";
    const to = sp.get("date_to") || "";

    const url = useMemo(() => {
        if (!selectedShop?.id) return "";
        const q = new URLSearchParams();
        if (period === "custom") {
            if (from) q.set("date_from", from);
            if (to) q.set("date_to", to);
        } else {
            q.set("period", period);
        }
        return `${selectedShop.id}/${ENDPOINT}?${q.toString()}`;
    }, [selectedShop?.id, period, from, to]);

    const { data, isLoading, isError, refetch } = useFetch<SellersRes>(url);
    const rows = data?.sellers ?? [];

    const baseDetail = `/${locale}/${role}/analytics/sellers`;

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

            {/* Davr ma’lumoti */}
            {data?.period && (
                <Card className="mb-3">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm">Sotuvchilar — umumiy ko‘rinish</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Davr: {data.period.from?.slice(0, 10)} — {data.period.to?.slice(0, 10)}
                    </CardContent>
                </Card>
            )}

            {isError && (
                <Card className="mb-4">
                    <CardContent className="pt-6 text-red-600 text-sm">
                        Xatolik: sotuvchilar ma’lumotlari yuklanmadi.
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sotuvchilar (umumiy)</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-[140px] flex items-center justify-center text-sm text-muted-foreground">
                            Yuklanmoqda…
                        </div>
                    ) : rows.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-muted-foreground">
                                <tr className="text-left">
                                    <th className="py-2 pr-3">Sotuvchi</th>
                                    <th className="py-2 pr-3">Buyurtmalar</th>
                                    <th className="py-2 pr-3">Mijozlar</th>
                                    <th className="py-2 pr-3">Mahsulotlar</th>
                                    <th className="py-2 pr-3">Tushum</th>
                                    <th className="py-2 pr-3">Foyda</th>
                                    <th className="py-2 pr-3">To‘lanmagan</th>
                                    <th className="py-2 pr-0">O‘rtacha chek</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map((s) => (
                                    <tr key={s.seller_id} className="border-t">
                                        <td className="py-2 pr-3">
                                            <Link
                                                href={`${baseDetail}/${s.seller_id}`}
                                                className="underline underline-offset-2"
                                                title="Detal ko‘rish"
                                            >
                                                {s.seller_label || s.seller_id}
                                            </Link>
                                        </td>
                                        <td className="py-2 pr-3">{fmt(s.orders_count)}</td>
                                        <td className="py-2 pr-3">{fmt(s.customers_count)}</td>
                                        <td className="py-2 pr-3">{fmt(s.products_sold)}</td>
                                        <td className="py-2 pr-3">{fmt(toNum(s.revenue_usd))}</td>
                                        <td className="py-2 pr-3">{fmt(toNum(s.profit_usd))}</td>
                                        <td className="py-2 pr-3">{fmt(toNum(s.unpaid_sum_usd))}</td>
                                        <td className="py-2 pr-0">
                                            {s.avg_check_usd != null ? fmt(toNum(s.avg_check_usd)) : "—"}
                                        </td>
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
