import useSWR, { SWRConfiguration, KeyedMutator } from "swr";
import { fetcher } from "@/lib/fetcher";

export interface FetchError {
  status: number;
  message: string;
  info?: any;
}

export interface UseFetchResponse<T> {
  data: T | undefined;
  safeData: T extends any[] ? T : T | Record<string, never>;
  isLoading: boolean;
  isError: FetchError | null;
  mutate: KeyedMutator<T>;
  refetch: () => Promise<T | undefined>;
}

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  refreshInterval: 0,
};

export const useFetch = <T = any>(
  url: string | null | undefined,
  config?: SWRConfiguration & { enabled?: boolean },
): UseFetchResponse<T> => {
  const { enabled = true, ...restConfig } = config || {};
  const mergedConfig: SWRConfiguration = { ...defaultConfig, ...restConfig };

  const shouldFetch = Boolean(url && enabled);

  const { data, error, isLoading, mutate } = useSWR<T, FetchError>(
    shouldFetch ? url : null,
    shouldFetch ? fetcher : null,
    mergedConfig,
  );

  const refetch = () => mutate(undefined, true);

  const safeData = (
    Array.isArray(data)
      ? data
      : typeof data === "object" && data !== null
        ? data
        : []
  ) as T extends any[] ? T : T | Record<string, never>;

  return {
    data,
    safeData,
    isLoading,
    isError: error || null,
    mutate,
    refetch,
  };
};

export default useFetch;
