import Cookies from "js-cookie";

interface SecureCookieOptions extends Cookies.CookieAttributes {
  httpOnly?: boolean;
}

const DEFAULT_EXPIRATION_DAYS = 30;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const setSecureCookie = (
  key: string,
  value: string,
  daysToExpire = DEFAULT_EXPIRATION_DAYS,
  options: SecureCookieOptions = {},
): void => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const { httpOnly, ...validOptions } = options;

  Cookies.set(key, value, {
    expires: expirationDate,
    secure: IS_PRODUCTION,
    sameSite: "Strict",
    path: "/",
    ...validOptions,
  });
};

export const clearAllCookies = (): void => {
  try {
    const allCookies = Cookies.get();
    const cookieKeys = Object.keys(allCookies);

    if (cookieKeys.length === 0) {
      console.log("No cookies to clear");
      return;
    }

    let removedCount = 0;
    for (const key of cookieKeys) {
      try {
        Cookies.remove(key, { path: "/" });
        removedCount++;
      } catch (error) {
        console.warn(`Failed to remove cookie "${key}":`, error);
      }
    }

    console.log(`Cleared ${removedCount} of ${cookieKeys.length} cookies`);
  } catch (error) {
    console.error("Failed to clear all cookies:", error);
    throw error;
  }
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const removeCookie = (key: string): void => {
  Cookies.remove(key, { path: "/" });
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authCookies = {
  setTokens: (accessToken: string, refreshToken: string): void => {
    const accessDays = 1;
    const refreshDays = 30;

    setSecureCookie(ACCESS_TOKEN_KEY, accessToken, accessDays);
    setSecureCookie(REFRESH_TOKEN_KEY, refreshToken, refreshDays);
  },

  getAccessToken: (): string | undefined => {
    return getCookie(ACCESS_TOKEN_KEY);
  },

  removeAccessToken: (): void => {
    removeCookie(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | undefined => {
    return getCookie(REFRESH_TOKEN_KEY);
  },

  removeTokens: (): void => {
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  },
};
