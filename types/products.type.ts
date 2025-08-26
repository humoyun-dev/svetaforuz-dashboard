export type Currency = "USD" | "UZS";

export type CountType =
  | "D" // Days
  | "L" // Liters
  | "ML" // Milliliters
  | "KG" // Kilograms
  | "G" // Grams
  | "MG" // Milligrams
  | "T" // Tons
  | "M" // Meters
  | "CM" // Centimeters
  | "MM" // Millimeters
  | "IN" // Inches
  | "FT" // Feet
  | "YD" // Yards
  | "PKG" // Package
  | "BOX" // Box
  | "SET" // Set
  | "PAIR" // Pair
  | "ROLL" // Roll
  | "PCS"; // Pieces

export interface CategoryType {
  id: number;
  name: string;
  slug: string;
  shop: number;
}

export interface ProductImageType {
  id: number;
  product: number;
  image: string;
  thumbnail: string;
}

export interface PropertiesType {
  id: number;
  product: number;
  feature: string;
  value: string;
}

export interface ProductStockEntries {
  id: number;
  product: number;
  quantity: number;
  unit_price: string;
  currency: Currency;
  exchange_rate: number;
  created_at: string;
  is_warehouse: boolean;
}

interface BaseProductType {
  id: number;
  name: string;
  enter_price: string;
  out_price: string;
  date_added: string;
  in_stock: boolean;
  currency: Currency;
  count: number;
  warehouse_count: number;
  exchange_rate: number;
  description?: string;
  category: CategoryType | null;
  count_type: CountType;
  images: ProductImageType[];
  sku?: string;
  remainder: number;
  barcode?: string;
}

export interface ListProductType extends BaseProductType {}

export interface CreateProductType extends BaseProductType {}

export interface DetailProductType extends BaseProductType {
  properties: PropertiesType[];
  stock_entries: ProductStockEntries[];
}

export interface PaginatedProductType {
  count: number;
  results: ListProductType[];
}

export interface PropertyFormData {
  feature: string;
  value: string;
}

export interface StockEntryFormData {
  quantity: string;
  id: number;
  unit_price: string;
  currency: Currency;
  exchange_rate: number;
  is_warehouse: boolean;
}

export interface ProductFormData {
  name: string;
  out_price: number;
  in_stock: boolean;
  description: string;
  exchange_rate: number;
  count_type: CountType;
  currency: Currency;
  properties: PropertyFormData[];
  stock: StockEntryFormData[];
}

export interface CategoryFormType {
  name: string;
}

export interface ExportProductsType {
  task_id: string;
  store_id: number;
  status: "PENDING" | "FAILED" | "PROCESSING" | "PROGRESS" | "SUCCESS";
  file_url: null | string;
  error_message: null | string;
  progress: number;
  started_at: null | string;
  completed_at: null | string;
  created_at: string;
}
