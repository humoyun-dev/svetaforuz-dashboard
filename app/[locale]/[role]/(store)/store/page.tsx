"use client";

import React, { useMemo, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { PaginatedStoreType } from "@/types/store.type";
import { Loading } from "@/components/loading/loading";
import TablePagination from "@/components/table/pagination.table";
import StoreTable from "@/components/table/store/store.table";
import { useSearchParams } from "next/navigation";
import { useStoreForm } from "@/hooks/use-store-form";

const Page = () => {
  const searchParams = useSearchParams();
  const { setOpen } = useStoreForm();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    return `store/?${params.toString()}`;
  }, [page]);

  const { safeData, isLoading } = useFetch<PaginatedStoreType>(url);

  return (
    <>
      <Header
        actions={
          <Button onClick={() => setOpen(true)} variant="secondary" size="sm">
            Create
          </Button>
        }
      />

      <div>
        {isLoading ? (
          <Loading className="h-[80vh]" />
        ) : (
          <div>
            <StoreTable data={safeData.results} />

            <TablePagination
              count={safeData.count}
              setPage={setPage}
              page={page}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
