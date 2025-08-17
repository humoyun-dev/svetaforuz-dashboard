import { Currency, ListProductType } from "@/types/products.type";

export interface StockEntryType {
  id: number;
  date: string;
  count: number;
  unit_price: string;
  currency: Currency;
  exchange_rate: string;
  is_warehouse: boolean;
  product: ListProductType;
}

export interface PaginatedStockEntryType {
  count: number;
  results: StockEntryType[];
}

export interface StockEntryFormType {
  count: string;
  unit_price: string;
  currency: Currency;
  is_warehouse: boolean;
  product: number;
}
