export const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
export const fmt = (n: number) => nf.format(n);
export const toNum = (x: number | string) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
};
