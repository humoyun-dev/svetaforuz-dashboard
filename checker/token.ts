import axios from "axios";
import { authCookies } from "@/lib/cookie";

export const handleCheckToken = async (): Promise<boolean> => {
  if (typeof window !== "undefined" && !navigator.onLine) {
    console.warn("Offline: Token check skipped.");
    return false;
  }

  const accessToken = authCookies.getAccessToken();
  const refreshToken = authCookies.getRefreshToken();

  if (!accessToken && !refreshToken) {
    authCookies.removeTokens();
    return false;
  }

  const verifyAccessToken = async (): Promise<boolean> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}accounts/token/verify/`,
        { access: accessToken },
      );
      return true;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return false;
      }
      console.error("Unexpected access token error:", error);
      return false;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}accounts/token/refresh/`,
        { refresh: refreshToken },
      );

      const newAccess = response.data?.access;
      const newRefresh = response.data?.refresh ?? refreshToken;

      if (newAccess) {
        authCookies.setTokens(newAccess, newRefresh);
        return true;
      }

      throw new Error("No access token in refresh response");
    } catch (error) {
      console.error("Failed to refresh tokens:", error);
      authCookies.removeTokens();
      return false;
    }
  };

  const accessValid = accessToken ? await verifyAccessToken() : false;
  if (accessValid) return true;

  return refreshToken ? await refreshAccessToken() : false;
};
