"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { CashboxBalance, PaginatedCashboxDocuments } from "@/types/store.type";
import { Loading } from "@/components/loading/loading";
import TablePagination from "@/components/table/pagination.table";
import { useSearchParams } from "next/navigation";
import CashboxDocumentsTable from "@/components/table/store/balance.table";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyPure } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrencyStore } from "@/stores/currency.store";

const Page = () => {
  const { selectedShop } = useStore();
  const searchParams = useSearchParams();
  const { usd, currency } = useCurrencyStore();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const [documents, setDocuments] = useState<PaginatedCashboxDocuments>({
    results: [],
    count: 0,
  });

  const urls = useMemo(() => {
    if (!selectedShop?.id) return "";

    const params = new URLSearchParams();
    params.set("page", page.toString());

    return `${selectedShop.id}/cashbox/transactions/?${params.toString()}`;
  }, [page, selectedShop?.id]);

  const { data, isLoading } = useFetch<PaginatedCashboxDocuments>(urls);
  const { data: balance, isLoading: isBalanceLoading } =
    useFetch<CashboxBalance>(`${selectedShop?.id}/cashbox/`);

  useEffect(() => {
    if (!isLoading && data) {
      setDocuments(data);
    }
  }, [data, isLoading]);

  return (
    <>
      <Header
        actions={
          <>
            {isBalanceLoading && !balance ? (
              <Skeleton className="h-8 w-[100px] rounded-lg" />
            ) : (
              balance?.balance && (
                <Badge
                  variant={
                    Number(balance.balance) < 0 ? "destructive" : "secondary"
                  }
                  className={`h-8 font-bold text-lg`}
                >
                  {formatCurrencyPure({
                    number: Number(balance.balance),
                    currency: "USD",
                    appCurrency: currency,
                    rate: usd,
                  })}
                </Badge>
              )
            )}
          </>
        }
      />

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <CashboxDocumentsTable data={documents.results} />

          <TablePagination
            count={documents.count}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </>
  );
};

export default Page;
