export type Granularity = "hour" | "day" | "week" | "month" | "year";

export function defaultGranularity(period: string): Granularity {
    switch (period) {
        case "daily": return "hour";
        case "weekly":
        case "monthly": return "day";
        case "yearly":
        case "all":
        default: return "month";
    }
}

export function normalizeGranularity(period: string, g: string): Granularity {
    const allowed: Record<string, Granularity[]> = {
        daily: ["hour","day"],
        weekly: ["day"],
        monthly: ["day"],
        yearly: ["month"],
        all: ["month","year"],
    };
    const list = allowed[period] || ["month"];
    return (list.includes(g as Granularity) ? g : list[0]) as Granularity;
}
