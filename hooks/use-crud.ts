import axios, { AxiosResponse } from "axios";
import { authCookies } from "@/lib/cookie";

interface RequestProps<T = any> {
  url: string;
  data?: T;
  ContentType?: "multipart/form-data" | "application/json";
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

const getToken = () => authCookies.getAccessToken();

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

const getAuthHeaders = (ContentType?: string) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (ContentType === "application/json") {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const useCrud = {
  async create<T>({
    url,
    data,
    ContentType = "application/json",
    signal,
  }: RequestProps): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    const headers = getAuthHeaders(isFormData ? undefined : ContentType);

    const response: AxiosResponse<T> = await apiClient.post(url, data, {
      headers,
      signal,
    });
    return { status: response.status, data: response.data };
  },

  async update<T>({
    url,
    data,
    ContentType = "application/json",
    signal,
  }: RequestProps): Promise<ApiResponse<T>> {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    const headers = getAuthHeaders(isFormData ? undefined : ContentType);

    const response: AxiosResponse<T> = await apiClient.patch(url, data, {
      headers,
      signal,
    });
    return { status: response.status, data: response.data };
  },

  async delete(url: string, signal?: AbortSignal): Promise<ApiResponse<null>> {
    const headers = getAuthHeaders();
    const response: AxiosResponse = await apiClient.delete(url, {
      headers,
      signal,
    });
    return { status: response.status, data: null };
  },
};
