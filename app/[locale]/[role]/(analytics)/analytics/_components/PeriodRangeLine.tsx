"use client";

import React, { useEffect, useMemo, useState } from "react";

type Item = { value: string; label: string }; // "YYYY" yoki "YYYY-MM"

export default function PeriodRangeLine({
                                            items,
                                            value,
                                            onChange,
                                            disabled,
                                            className = "",
                                        }: {
    items: Item[]; // tartiblangan
    value?: { startIndex: number; endIndex: number };
    onChange: (start: Item, end: Item, startIndex: number, endIndex: number) => void;
    disabled?: boolean;
    className?: string;
}) {
    const n = items.length;
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(Math.max(0, n - 1));

    // tashqi qiymat bilan sinxron
    useEffect(() => {
        if (!value) return;
        const s = Math.min(Math.max(0, value.startIndex), Math.max(0, n - 1));
        const e = Math.min(Math.max(0, value.endIndex), Math.max(0, n - 1));
        setStart(s);
        setEnd(e);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(value), n]);

    // parentga xabar
    useEffect(() => {
        if (!n) return;
        const si = Math.min(start, end);
        const ei = Math.max(start, end);
        onChange(items[si], items[ei], si, ei);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end, n]);

    if (!n) return null;

    const totalSteps = Math.max(1, n - 1);
    const si = Math.min(start, end);
    const ei = Math.max(start, end);
    const oneStepPct = 100 / totalSteps;

    // tanlangan segment pozitsiyasi (bitta oy bo'lsa ham segment keng)
    let leftPct = (si / totalSteps) * 100;
    let rightPct = ((totalSteps - ei) / totalSteps) * 100;

    if (si === ei && n > 1) {
        // bitta element tanlangan bo'lsa — bir stepga kengaytiramiz
        const half = oneStepPct / 2;
        leftPct = Math.max(0, leftPct - half);
        rightPct = Math.max(0, rightPct - half);
    }

    const leftHandlePct = (si / totalSteps) * 100;
    const rightHandlePct = (ei / totalSteps) * 100;

    return (
        <div className={`w-full ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{items[si]?.label}</span>
                <span>{items[ei]?.label}</span>
            </div>

            <div className="relative h-8 select-none">
                {/* Track */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded bg-muted" />
                {/* Selected segment (qora) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-foreground"
                    style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
                />
                {/* Vizual markerlar (har ikki chet) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3 bg-foreground rounded"
                    style={{ left: `calc(${leftHandlePct}% - 1px)` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3 bg-foreground rounded"
                    style={{ left: `calc(${rightHandlePct}% - 1px)` }}
                />

                {/* Ikki diapazon input (real boshqaruv) */}
                <input
                    type="range"
                    min={0}
                    max={Math.max(0, n - 1)}
                    value={start}
                    onChange={(e) => setStart(Number(e.target.value))}
                    className="absolute w-full top-0 appearance-none bg-transparent pointer-events-auto"
                    style={{ height: "100%" }}
                />
                <input
                    type="range"
                    min={0}
                    max={Math.max(0, n - 1)}
                    value={end}
                    onChange={(e) => setEnd(Number(e.target.value))}
                    className="absolute w-full top-0 appearance-none bg-transparent pointer-events-auto"
                    style={{ height: "100%" }}
                />

                {/* Thumblarni biroz chiroyliroq qilamiz */}
                <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            background: white;
            border: 2px solid hsl(var(--primary));
            border-radius: 9999px;
            cursor: pointer;
            margin-top: -6px;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
          }
          input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: white;
            border: 2px solid hsl(var(--primary));
            border-radius: 9999px;
            cursor: pointer;
          }
        `}</style>
            </div>
        </div>
    );
}
