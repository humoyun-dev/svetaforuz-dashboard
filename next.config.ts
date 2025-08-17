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
    NEXT_PUBLIC_SERVER_URL: "http://localhost:8000/platform/",
    NEXT_PUBLIC_WS_URL: "ws://localhost:8000/ws/notifications/",
    // NEXT_PUBLIC_SERVER_URL: "http://127.0.0.1:8000/platform/",
    NEXT_PUBLIC_YANDEX_MAPS_API_KEY: "c9a08bdc-e348-4de7-b9b4-b4f02f5fd7f7",
  },
};

export default nextConfig;
