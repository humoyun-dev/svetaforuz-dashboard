import { Currency, ListProductType } from "@/types/products.type";
import { ListOrderType } from "@/types/orders.type";

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

export interface ProductSalesType {
  id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  profit: string;
  currency: Currency;
  exchange_rate: string;
  created_at: string;
  order: ListOrderType;
  product: ListProductType;
}

export interface PaginatedProductSalesType {
  count: number;
  results: ProductSalesType[];
}
