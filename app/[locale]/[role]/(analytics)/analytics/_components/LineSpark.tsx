"use client";
export function LineSpark({
                              points, getY, height = 160, yLabel,
                          }:{
    points: any[]; getY: (p:any)=>number; height?:number; yLabel?:string;
}) {
    if (!points?.length) return <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">Ma’lumot yo‘q</div>;
    const vals = points.map(getY);
    const min = Math.min(...vals), max = Math.max(...vals);
    const pad = (max - min) * .1 || 1, yMin = min - pad, yMax = max + pad;
    const w = Math.max(points.length * 36, 360), h = height, left = 28;
    const x = (i:number)=> (i / (points.length - 1 || 1)) * (w - left - 8) + left;
    const y = (v:number)=> { const t=(v - yMin)/(yMax - yMin); return h - 20 - t*(h - 36); };
    const d = points.map((p,i)=>`${i?"L":"M"} ${x(i)} ${y(getY(p))}`).join(" ");
    return (
        <div className="w-full overflow-auto">
            <svg width={w} height={h}>
                {yLabel ? <text x={0} y={12} className="fill-current text-[10px] opacity-60">{yLabel}</text> : null}
                <line x1={left} y1={h-20} x2={w} y2={h-20} stroke="currentColor" opacity=".12" />
                <line x1={left} y1={0} x2={left} y2={h} stroke="currentColor" opacity=".12" />
                <path d={d} fill="none" stroke="currentColor" strokeWidth={2} />
                {points.map((p,i)=><circle key={i} cx={x(i)} cy={y(getY(p))} r={2.5} />)}
            </svg>
        </div>
    );
}
