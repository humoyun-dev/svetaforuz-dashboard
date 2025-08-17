"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import { useUserStore } from "@/stores/user.store";
import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading/loading";
import { PaginatedOrdersType } from "@/types/orders.type";
import TablePagination from "@/components/table/pagination.table";
import OrdersTable from "@/components/table/orders/orders.table";

const Page = () => {
  const { t } = useTranslation("orders");
  const { role } = useUserStore();
  const { selectedShop } = useStore();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);

  const {
    safeData: data,
    refetch,
    isLoading,
  } = useFetch<PaginatedOrdersType>(`${selectedShop?.id}/orders/orders/`);

  return (
    <>
      <Header
        actions={
          <Button variant="link" size="sm" asChild>
            <Link href={`/${role}/orders/create`}>{t("create_order")}</Link>
          </Button>
        }
      />

      <div className="flex mb-4 gap-x-2 flex-wrap">
        <Input
          className="md:w-96 w-full"
          type="search"
          value={search}
          placeholder={t("search_placeholder")}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <OrdersTable data={data.results} refetch={refetch} />
          <TablePagination count={data.count} setPage={setPage} page={page} />
        </div>
      )}
    </>
  );
};

export default Page;
