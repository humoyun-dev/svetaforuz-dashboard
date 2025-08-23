"use client";

import Link from "next/link";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
    analytics: "Analytics",
    overview: "Overview",
    sections: "", // ko‘rsatmaymiz
    sales: "Sales",
    products: "Products",
    debts: "Debts",
    refunds: "Refunds",
    stock: "Stock",
    sellers: "Sellers",
    // kerak bo‘lsa bu yerga boshqalarni ham qo‘shasiz
};

type Props = { locale: string; role: string };

export default function BreadcrumbBar({ locale, role }: Props) {
    const router = useRouter();

    // Bu layout `analytics` ichida turadi, shuning uchun
    // keyingi segmentlar: ["sections","sales"] yoki ["overview"] ...
    const segs = useSelectedLayoutSegments();

    // Bazaviy crumb’lar
    const base = `/${locale}/${role}`;
    const trail: Array<{ href: string; label: string }> = [
        { href: base, label: "Admin" },
        { href: `${base}/analytics`, label: "Analytics" },
    ];

    // “sections/<page>” bo‘lsa — faqat <page> kerak
    let i = 0;
    while (i < segs.length) {
        const s = segs[i];
        if (s === "sections") {
            i++;
            continue;
        }
        const href = `${base}/analytics/${segs.slice(0, i + 1).join("/")}`;
        const label = LABELS[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
        if (label) trail.push({ href, label });
        i++;
    }

    return (
        <div className="flex items-center gap-2 py-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.back()}
                aria-label="Back"
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <nav
                className="flex items-center text-sm text-muted-foreground"
                aria-label="Breadcrumb"
            >
                {trail.map((t, idx) => (
                    <span key={t.href} className="inline-flex items-center">
            {idx > 0 && <ChevronRight className="mx-1 h-4 w-4 opacity-60" />}
                        {idx === trail.length - 1 ? (
                            <span className="text-foreground font-medium">{t.label}</span>
                        ) : (
                            <Link href={t.href} className="hover:underline">
                                {t.label}
                            </Link>
                        )}
          </span>
                ))}
            </nav>
        </div>
    );
}
