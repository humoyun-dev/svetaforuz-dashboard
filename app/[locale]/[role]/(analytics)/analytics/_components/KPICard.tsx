"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KPICard({ title, value, loading }:{
    title:string; value:string|number; loading?:boolean;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{loading ? "…" : value}</CardContent>
        </Card>
    );
}
