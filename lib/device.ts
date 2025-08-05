import { UAParser } from "ua-parser-js";
import { NextRequest } from "next/server";

export interface DeviceInfo {
  device_type: string;
  os: string;
  browser: string;
  brand: string;
  model: string;
  ip_address: string | null;
  where: string;
}

export function getClientDeviceInfo(): DeviceInfo {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    device_type: result.device.type || "desktop",
    os: result.os.name || "unknown",
    browser: result.browser.name || "unknown",
    brand: result.device.vendor || "unknown",
    model: result.device.model || "unknown",
    ip_address: null,
    where: "platform",
  };
}

export function getServerDeviceInfo(req: NextRequest): DeviceInfo {
  const userAgent = req.headers.get("user-agent") || "";

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "::1";

  return {
    device_type: result.device?.type || "desktop",
    os: result.os?.name || "unknown",
    browser: result.browser?.name || "unknown",
    brand: result.device?.vendor || "unknown",
    model: result.device?.model || "unknown",
    ip_address: ip,
    where: "platform",
  };
}
