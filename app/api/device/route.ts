import { getServerDeviceInfo } from "@/lib/device";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const device = getServerDeviceInfo(req);
  return NextResponse.json(device);
}
