import { create } from "zustand";

export interface DeviceInfo {
  device_type: string;
  os: string;
  browser: string;
  brand: string;
  model: string;
  ip_address: string | null;
  where: string;
}

interface DeviceStore {
  device: DeviceInfo | null;
  setDevice: (device: DeviceInfo) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  device: null,
  setDevice: (device) => set({ device }),
}));
