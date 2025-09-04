import { Currency, ListProductType } from "@/types/products.type";

export interface TransactionUserType {
  id: number;
  is_deleted: boolean;
  deleted_at: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  transferred: string;
  accepted: string;
  balance: string;
  currency: Currency;
  exchange_rate: string;
  created_at: string;
  store: number;
}

export interface TransactionUserFormType {
  phone_number: string;
  first_name: string;
  last_name: string;
}

export interface TransactionDocumentType {
  id: number;
  products: TransactionDocumentProductType[];
  is_deleted: true;
  deleted_at: string;
  is_mirror: true;
  phone_number: string;
  first_name: string;
  last_name: string;
  method: string;
  currency: Currency;
  exchange_rate: string;
  cash_amount: string;
  product_amount: string;
  total_amount: string;
  income: string;
  date: string;
  debtuser: number;
  store: number;
  owner: number;
}

export interface TransactionDocumentProductType {
  id: number;
  quantity: number;
  price: string;
  amount: string;
  currency: Currency;
  exchange_rate: string;
  income: string;
  document: number;
  product: number;
}

export interface TransactionDocumentForm {
  products: TransactionDocumentProductForm[];
  method: TransactionMethod;
  currency: Currency;
  cash_amount: string;
}

export interface TransactionDocumentProductForm {
  quantity: string;
  price: string;
  currency: Currency;
  product: number;
  product_data: ListProductType;
}

export type TransactionMethod = "transfer" | "accept";
