import axios from "axios";
import { authCookies, getCookie } from "@/lib/cookie";

export const fetcher = async (url: string) => {
  const token = authCookies.getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
      {
        headers,
      },
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
