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
