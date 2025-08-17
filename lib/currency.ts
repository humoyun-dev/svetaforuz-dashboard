interface CurrencyParams {
  number: string | number;
  currency?: string;
  rate: number;
  appCurrency?: string;
}

function convertCurrency({
  number,
  currency = "USD",
  rate,
  appCurrency = "UZS",
}: CurrencyParams): number {
  const normalized = String(number).replace(/\s/g, "").replace(/,/g, ".");

  const amount = Number(normalized);

  const source = currency.toUpperCase();
  const target = appCurrency.toUpperCase();

  if (source === target) return amount;

  if (source === "USD" && target === "UZS") {
    return amount * rate;
  }

  if (source === "UZS" && target === "USD") {
    return amount / rate;
  }

  return amount;
}

export function formatCurrencyPure(params: CurrencyParams): string | undefined {
  const converted = Number(convertCurrency(params));

  if (converted === undefined) return undefined;

  const currencyCode = (params.appCurrency || "UZS").toUpperCase();

  try {
    const formatted = new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: currencyCode === "USD" ? 2 : 0,
      maximumFractionDigits: currencyCode === "USD" ? 2 : 0,
    }).format(converted);

    if (currencyCode === "UZS") {
      return `${formatted} so'm`;
    } else if (currencyCode === "USD") {
      return `$${formatted}`;
    } else {
      return `${formatted} ${currencyCode}`;
    }
  } catch (e) {
    console.warn(`Invalid currency format for: ${currencyCode}`, e);
    return undefined;
  }
}

export function unFormatCurrencyPure(params: CurrencyParams): number {
  return convertCurrency(params);
}
