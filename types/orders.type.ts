import { Currency, ListProductType } from "@/types/products.type";

export interface BaseOrderType {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  currency: Currency;
  exchange_rate: string;
  payment_type: "cash" | "card";
  paid_amount: string;
  change_given: boolean;
  change_amount: string;
  total_price: string;
  total_profit: string;
  unreturned_income: number;
  created_at: string;
  is_deleted: boolean;
  deleted_at: null | string;
  currency_change: Currency;
}

export interface OrderItemsType {
  id: number;
  product: ListProductType;
  quantity: number;
  price: string;
  currency: Currency;
  exchange_rate: string;
}

export interface ListOrderType extends BaseOrderType {}

export interface DetailOrderType extends BaseOrderType {
  items: OrderItemsType[];
}

export interface PaginatedOrdersType {
  count: number;
  results: ListOrderType[];
}

export interface OrderItemsFormType {
  product_id: number;
  product_data: ListProductType;
  quantity: string;
  price: string;
  currency: Currency;
}

export interface OrderFormType {
  phone_number: string;
  first_name: string;
  last_name: string;
  currency: Currency;
  payment_type: "cash" | "card";
  paid_amount: string;
  change_given: boolean;
  change_amount: string;
  currency_change: Currency;
}
