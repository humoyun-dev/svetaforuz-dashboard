import { useEffect } from "react";
import { useCurrencyStore } from "@/stores/currency.store";
import useFetch from "@/hooks/use-fetch";

export function useUserRateCheck() {
  const { setUsd, usd, toggleChangeMode } = useCurrencyStore();

  const { data, isLoading, isError } = useFetch<{
    user_id: number;
    rate: string;
    date: string;
  }>(`user/rates/my/`);

  useEffect(() => {
    if (!data || isLoading || isError) return;

    const rate = Number(data.rate);

    if (rate !== usd) {
      setUsd(rate);
    }

    if (rate === 0) {
      toggleChangeMode(true);
    } else {
      toggleChangeMode(false);
    }
  }, [data, isLoading, isError, usd, setUsd, toggleChangeMode]);
}
