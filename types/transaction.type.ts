import { Currency, ListProductType } from "@/types/products.type";

export interface TransactionUserType {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  profile_image: null | string;
  transferred: string;
  accepted: string;
  balance: string;
  currency: Currency;
  exchange_rate: string;
  created_at: string;
  store: number;
}

export interface TransactionDocumentType {
  id: number;
  products: ListProductType[];
  is_deleted: false;
  deleted_at: null;
  is_mirror: false;
  phone_number: string;
  first_name: string;
  last_name: string;
  method: string;
  currency: string;
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
