"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { Loading } from "@/components/loading/loading";
import TablePagination from "@/components/table/pagination.table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ImportProductModal from "@/components/modals/import-product.modal";
import { PaginatedProductSalesType } from "@/types/systems.type";
import SalesProductTable from "@/components/table/systems/sales-product.table";

const Page = () => {
  const { selectedShop } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const queryParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams],
  );

  const productsUrl = useMemo(() => {
    if (!selectedShop?.id) return "";

    const params = new URLSearchParams();
    params.set("page", page.toString());

    return `${selectedShop.id}/system/sales/?${params.toString()}`;
  }, [page, selectedShop?.id]);

  useEffect(() => {
    const params = new URLSearchParams(queryParamsString);
    page === 1 ? params.delete("page") : params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [page, pathname, queryParamsString, router]);

  const { safeData, isLoading, refetch } =
    useFetch<PaginatedProductSalesType>(productsUrl);

  return (
    <>
      <Header />

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <SalesProductTable refetch={refetch} data={safeData.results} />
          <TablePagination
            count={safeData.count}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
      <ImportProductModal />
    </>
  );
};

export default Page;
