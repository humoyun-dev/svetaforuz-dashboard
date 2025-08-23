"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    defaultGranularity,
    normalizeGranularity,
    type Granularity,
} from "../_lib/granularity";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

type Period = "daily" | "weekly" | "monthly" | "yearly" | "all" | "custom";

function allowed(period: Period): Granularity[] {
    switch (period) {
        case "daily":
            return ["hour", "day"];
        case "weekly":
            return ["day", "week"];
        case "monthly":
            return ["day"];
        case "yearly":
            return ["month"];
        case "all":
        default:
            return ["month", "year"];
    }
}

// yyyy-mm-dd
const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
const currentMonthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const currentMonthEnd = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

export default function PeriodControls() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const period = (sp.get("period") as Period) || "monthly";
    const gran0 =
        (sp.get("granularity") as Granularity) || defaultGranularity(period);
    const granularity = normalizeGranularity(period, gran0);
    const dateFrom = sp.get("date_from") || "";
    const dateTo = sp.get("date_to") || "";

    const setParams = (patch: Partial<Record<string, string>>) => {
        const q = new URLSearchParams(sp.toString());
        Object.entries(patch).forEach(([k, v]) => {
            if (!v) q.delete(k);
            else q.set(k, v);
        });

        const p = (q.get("period") as Period) || "monthly";
        const g = normalizeGranularity(
            p,
            (q.get("granularity") as Granularity) || defaultGranularity(p),
        );
        q.set("granularity", g);
        if (p !== "custom") {
            q.delete("date_from");
            q.delete("date_to");
        }
        router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    };

    const periodItems: { key: Period; label: string }[] = [
        { key: "daily", label: "Kunlik" },
        { key: "weekly", label: "Haftalik" },
        { key: "monthly", label: "Oylik" },
        { key: "yearly", label: "Yillik" },
        { key: "all", label: "Barchasi" },
        { key: "custom", label: "Ixtiyoriy" }, // pastda
    ];

    const granLabels: Record<Granularity, string> = {
        hour: "Soat",
        day: "Kun",
        week: "Hafta",
        month: "Oy",
        year: "Yil",
    };

    const onPeriodChange = (p: Period) => {
        if (p === "custom") {
            const f = fmtDate(currentMonthStart());
            const t = fmtDate(currentMonthEnd());
            // Ixtiyoriyga o'tganda default – shu oy
            setParams({
                period: "custom",
                granularity: "month",
                date_from: f,
                date_to: t,
            });
        } else {
            setParams({
                period: p,
                granularity: defaultGranularity(p),
            });
        }
    };

    const onGranChange = (g: Granularity) => {
        // Ixtiyoriy rejimida sanalar yo'q bo'lsa – hozirgi oyga to'ldirib qo'yamiz
        if (period === "custom" && (!dateFrom || !dateTo)) {
            const f = fmtDate(currentMonthStart());
            const t = fmtDate(currentMonthEnd());
            setParams({ granularity: g, date_from: f, date_to: t, period: "custom" });
        } else {
            setParams({ granularity: g });
        }
    };

    const onDateChange = (patch: Partial<{ date_from: string; date_to: string }>) => {
        // Sana qo'lda o'zgarsa — Ixtiyoriy
        setParams({ period: "custom", ...patch });
    };

    const opts = allowed(period);

    return (
        <div className="flex flex-wrap items-end gap-2">
            {/* Davr */}
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Davr</span>
                <Select value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Davr" />
                    </SelectTrigger>
                    <SelectContent>
                        {periodItems.map((p) => (
                            <SelectItem key={p.key} value={p.key}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Detallash */}
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Detallash</span>
                <Select value={granularity} onValueChange={(v) => onGranChange(v as Granularity)}>
                    <SelectTrigger className="w-28 h-9">
                        <SelectValue placeholder="Detallash" />
                    </SelectTrigger>
                    <SelectContent>
                        {opts.map((g) => (
                            <SelectItem key={g} value={g}>
                                {granLabels[g]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Ixtiyoriy bo'lsa sanalar ko'rinadi */}
            {period === "custom" && (
                <>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Boshlanish</span>
                        <Input
                            className="h-9 w-40"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => onDateChange({ date_from: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Tugash</span>
                        <Input
                            className="h-9 w-40"
                            type="date"
                            value={dateTo}
                            onChange={(e) => onDateChange({ date_to: e.target.value })}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
