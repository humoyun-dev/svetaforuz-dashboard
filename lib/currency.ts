interface CurrencyParams {
  number: string | number;
  currency?: string;
  rate: number;
  appCurrency?: string;
}

export function convertCurrency({
  number,
  currency = "USD",
  rate,
  appCurrency = "UZS",
}: CurrencyParams): number {
  // Handle string input with potential comma as decimal separator
  let amount: number;
  if (typeof number === "string") {
    // Replace comma with dot for decimal parsing, remove thousands separators
    const cleaned = number.replace(/,/g, ".").replace(/\s/g, "");
    amount = parseFloat(cleaned);
  } else {
    amount = number;
  }

  if (isNaN(amount)) return 0;

  const source = currency.toUpperCase();
  const target = (appCurrency || "UZS").toUpperCase();

  if (source === target) return amount;
  if (source === "USD" && target === "UZS") return amount * rate;
  if (source === "UZS" && target === "USD") return amount / rate;

  return amount;
}
export function formatCurrencyPure(params: CurrencyParams): string {
  const converted = convertCurrency(params);
  const currencyCode = (params.appCurrency || "UZS").toUpperCase();
  const isUSD = currencyCode === "USD";

  // For USD: use custom formatting with spaces and dots
  if (isUSD) {
    const parts = converted.toFixed(2).split(".");
    const wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `$${wholeNumber}.${parts[1]}`;
  }

  // For UZS and others: use Russian locale formatting
  const formatted = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);

  switch (currencyCode) {
    case "UZS":
      return `${formatted} so'm`;
    case "USD":
      return `$${formatted}`;
    default:
      return `${formatted} ${currencyCode}`;
  }
}

export function unFormatCurrencyPure(params: CurrencyParams): number {
  return convertCurrency(params);
}
