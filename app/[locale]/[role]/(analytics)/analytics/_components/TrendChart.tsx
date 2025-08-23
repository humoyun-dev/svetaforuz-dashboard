"use client";

import * as React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

type SeriesDef<T> = { name: string; dataKey: keyof T; color?: string };
type Props<T extends Record<string, any>> = {
    data: T[];
    series: SeriesDef<T>[];
    height?: number;
    yLabel?: string;
    xKey?: keyof T;                  // default: "date"
    valueFormatter?: (v: number) => string;
};

const palette = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#14b8a6"];
const shortDate = (s: string) => (/^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(5) : s);

export default function TrendChart<T extends Record<string, any>>({
                                                                      data,
                                                                      series,
                                                                      height = 260,
                                                                      yLabel = "",
                                                                      xKey = "date" as keyof T,
                                                                      valueFormatter,
                                                                  }: Props<T>) {
    const fmt = valueFormatter ?? ((n: number) =>
        Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n));

    return (
        <div className="w-full">
            <div className="text-xs text-muted-foreground mb-1">{yLabel}</div>
            <div style={{ width: "100%", height }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={xKey as string}
                            tickFormatter={(v: string) => shortDate(String(v))}
                            tick={{ fontSize: 11 }}
                            minTickGap={24}
                        />
                        <YAxis
                            tickFormatter={(v: number) => fmt(Number(v))}
                            width={56}
                            tick={{ fontSize: 11 }}
                            domain={[0, "auto"]}
                        />
                        <Tooltip
                            formatter={(value: any, name: any) => {
                                const num = Number(value);
                                return [Number.isFinite(num) ? fmt(num) : String(value), String(name)];
                            }}
                            labelFormatter={(label) => String(label)}
                        />
                        <Legend verticalAlign="top" height={24} />
                        {series.map((s, i) => (
                            <Line
                                key={String(s.dataKey)}
                                type="monotoneX"
                                connectNulls
                                dataKey={s.dataKey as string}
                                name={s.name}
                                stroke={s.color ?? palette[i % palette.length]}
                                strokeWidth={2.25}
                                dot={{ r: 3 }}
                                activeDot={{ r: 4.5 }}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
