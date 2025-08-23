"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

/** kichik classnames helper */
function cx(...cls: Array<string | false | null | undefined>) {
    return cls.filter(Boolean).join(" ");
}

type Tab = { slug: string; label: string };

/** Kerakli tablar (cashbox yo‘q) – O‘ZBEKCHA YORLIQLAR */
const TABS: Tab[] = [
    { slug: "",         label: "Umumiy ko‘rinish" },
    { slug: "sales",    label: "Sotuvlar" },
    { slug: "products", label: "Mahsulotlar" },
    { slug: "debts",    label: "Qarzlar" },
    { slug: "sellers",  label: "Sotuvchilar" },
];

/** Breadcrumb uchun o‘zbekcha nomlar */
const LABELS: Record<string, string> = {
    analytics: "Tahlil",
    overview: "Umumiy ko‘rinish",
    sales: "Sotuvlar",
    products: "Mahsulotlar",
    debts: "Qarzlar",
    refunds: "Qaytarishlar",
    stock: "Ombor",
    sellers: "Sotuvchilar",
    sections: "", // ko‘rsatmaymiz
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { locale, role } = useParams() as { locale: string; role: string };

    const base = `/${locale}/${role}`;
    const analyticsBase = `${base}/analytics`;

    // Breadcrumb yo‘li: /.../analytics/[...]
    const segs = pathname.split("/").filter(Boolean);
    const idx = segs.indexOf("analytics");
    const tail = idx >= 0 ? segs.slice(idx + 1) : [];

    // Admin > Tahlil > (Umumiy ko‘rinish | Sotuvlar | ... | #id)
    const crumbs: Array<{ href: string; label: string }> = [
        { href: base, label: "Admin" },            // xohlasa "Boshqaruv" deb ham yozish mumkin
        { href: analyticsBase, label: "Tahlil" },
    ];

    if (tail.length === 0) {
        crumbs.push({ href: analyticsBase, label: "Umumiy ko‘rinish" });
    } else {
        let accum = analyticsBase;
        tail.forEach((s) => {
            accum += `/${s}`;
            const isId = /^\d+$/.test(s);
            const label =
                LABELS[s] ??
                (isId ? `#${s}` : s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
            if (label) crumbs.push({ href: accum, label });
        });
    }

    return (
        <div className="space-y-4">
            {/* Breadcrumb — Store sahifasidagidek */}
            <div className="mx-auto max-w-full px-2">
                <div className="flex items-center gap-2 py-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => history.back()}
                        aria-label="Orqaga"
                        title="Orqaga"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <nav
                        className="flex items-center text-sm text-muted-foreground"
                        aria-label="Breadcrumb"
                    >
                        {crumbs.map((c, i) => (
                            <span key={c.href} className="inline-flex items-center">
                {i > 0 && <ChevronRight className="mx-1 h-4 w-4 opacity-60" />}
                                {i === crumbs.length - 1 ? (
                                    <span className="text-foreground font-medium">{c.label}</span>
                                ) : (
                                    <Link href={c.href} className="hover:underline">
                                        {c.label}
                                    </Link>
                                )}
              </span>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Sticky tabbar – hamisha yuqorida, fon/blur bilan */}
            <div className="sticky -top-px z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="mx-auto max-w-full px-2">
                    <nav role="tablist" className="flex items-center gap-2 overflow-x-auto py-2">
                        {TABS.map((t) => {
                            const href = t.slug ? `${analyticsBase}/${t.slug}` : analyticsBase;
                            const active =
                                pathname === href ||
                                (t.slug === "" &&
                                    (pathname === analyticsBase || pathname === `${analyticsBase}/`));

                            return (
                                <Link
                                    key={t.slug || "overview"}
                                    href={href}
                                    role="tab"
                                    aria-selected={active}
                                    className={cx(
                                        "whitespace-nowrap rounded-md border px-3 py-1.5 text-sm transition-colors",
                                        active
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-muted/60 hover:bg-muted border-border"
                                    )}
                                >
                                    {t.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Kontent */}
            <div className="mx-auto max-w-full">{children}</div>
        </div>
    );
}
