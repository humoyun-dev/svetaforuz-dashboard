// lib/http.ts
import axios from "axios";
import { authCookies } from "@/lib/cookie";
import { isTokenValid } from "@/lib/jwt";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // e.g. "http://localhost:8000/platform/"
});

// Always attach Authorization if we have a valid token
api.interceptors.request.use((config) => {
  const token = authCookies.getAccessToken();
  if (token && isTokenValid(token)) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});
