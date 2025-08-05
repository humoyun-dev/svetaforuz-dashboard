export interface UserType {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: null | "male" | "female";
  profile_image: null | string;
}

export type StaffType =
  | "admin"
  | "manager"
  | "seller"
  | "deliverer"
  | "cashier"
  | "stockman"
  | "viewer";

type Device = "desktop" | "mobile" | "tablet";
type OperatingSystem = "Windows" | "macOS" | "Linux" | "iOS" | "Android";
type Browser = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera";
type Location = "home" | "work" | "platform" | "unknown";

export type DeviceType = {
  id: number;
  device_type: Device;
  os: OperatingSystem;
  browser: Browser;
  brand: string;
  model: string;
  ip_address: string;
  last_login: string;
  where: Location;
  is_active: boolean;
};
