"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { GitPullRequestCreateArrow } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { PaginatedStockEntryType } from "@/types/systems.type";
import { useStore } from "@/stores/store.store";
import { Loading } from "@/components/loading/loading";
import TablePagination from "@/components/table/pagination.table";
import StockEntryTable from "@/components/table/systems/stockentry.table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useImportStore } from "@/hooks/use-import-product";
import ImportProductModal from "@/components/modals/import-product.modal";
import { useTranslation } from "react-i18next"; // ⬅️ qo‘shildi

const Page = () => {
  const { t } = useTranslation(); // ⬅️ qo‘shildi
  const { selectedShop } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setOpen } = useImportStore();

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

    return `${selectedShop.id}/system/product-entries/?${params.toString()}`;
  }, [page, selectedShop?.id]);

  useEffect(() => {
    const params = new URLSearchParams(queryParamsString);
    page === 1 ? params.delete("page") : params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [page, pathname, queryParamsString, router]);

  const { safeData, isLoading, refetch } =
    useFetch<PaginatedStockEntryType>(productsUrl);

  return (
    <>
      <Header
        actions={
          <Button onClick={() => setOpen(true)} size={"sm"}>
            <GitPullRequestCreateArrow />
            {t("actions.create")}
          </Button>
        }
      />

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <StockEntryTable refetch={refetch} data={safeData.results} />
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
