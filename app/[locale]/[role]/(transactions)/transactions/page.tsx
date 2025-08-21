"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { TransactionUserType } from "@/types/transaction.type";
import TransactionsUserTable from "@/components/table/transactions/transactions.table";
import { Loading } from "@/components/loading/loading";
import TablePagination from "@/components/table/pagination.table";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const { selectedShop } = useStore();

  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const [transaction, setTransactions] = useState<{
    results: TransactionUserType[];
    count: number;
  }>({
    results: [],
    count: 1,
  });

  const { data, refetch, isLoading } = useFetch<{
    results: TransactionUserType[];
    count: number;
  }>(`${selectedShop?.id}/debt/documents/`);

  useEffect(() => {
    if (data && !isLoading) {
      setTransactions(data);
    }
  }, [data, isLoading]);

  return (
    <>
      <Header />

      {isLoading && !data ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <TransactionsUserTable data={transaction.results} refetch={refetch} />

          <TablePagination
            count={transaction.count}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </>
  );
};

export default Page;
