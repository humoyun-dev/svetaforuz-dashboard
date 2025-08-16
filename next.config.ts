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
  },
};

export default nextConfig;
