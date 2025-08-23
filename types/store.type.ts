import { StaffType } from "@/types/user.type";

export interface StoreType {
  id: number;
  name: string;
  description: string;
  phone_number?: string;
  address: string;
  latitude?: string;
  longitude?: string;
  logo?: string;
  banner?: string;
  created_at: string;
  owner: number;
  role: StaffType;
}

export interface PaginatedStoreType {
  count: number;
  results: StoreType[];
}

export interface StoreForm {
  name: string;
  description: string;
  address: string;
  phone_number?: string;
  latitude?: string;
  longitude?: string;
  logo?: string;
  banner?: string;
}

export interface CashboxBalance {
  id: number;
  store_id: number;
  store_name: string;
  balance: string;
}

export interface CashboxDocuments {
  id: number;
  cashbox: number;
  amount: string;
  is_out: false;
  direction: "out" | "into";
  created_at: string;
  note: string;
  order: number;
  manual_source: string;
  exchange_rate: string;
}

export interface PaginatedCashboxDocuments {
  count: number;
  results: CashboxDocuments[];
}
