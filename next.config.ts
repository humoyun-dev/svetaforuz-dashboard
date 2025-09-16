import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
  env: {
    // NEXT_PUBLIC_SERVER_URL: "http://localhost:8000/platform/",
    NEXT_PUBLIC_WS_URL: "ws://localhost:8000/ws/notifications/",
    NEXT_PUBLIC_SERVER_URL: "https://api.svetafor.uz/platform/",
    NEXT_PUBLIC_YANDEX_MAPS_API_KEY: "c9a08bdc-e348-4de7-b9b4-b4f02f5fd7f7",
    NEXT_PUBLIC_URL: "https://app.svetafor.uz",
  },
};

export default nextConfig;
