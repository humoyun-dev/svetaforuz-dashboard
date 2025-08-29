"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { Loading } from "@/components/loading/loading";
import {
  CategoryType,
  ExportProductsType,
  PaginatedProductType,
} from "@/types/products.type";
import ProductsTable from "@/components/table/products/products.table";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";
import TablePagination from "@/components/table/pagination.table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { SearchableCombobox } from "@/components/combobox/search.combobox";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";

const Page = () => {
  const { t } = useTranslation("products");
  const { selectedShop } = useStore();
  const { role } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const queryParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams],
  );

  const productsUrl = useMemo(() => {
    if (!selectedShop?.id) return "";

    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    return `${selectedShop.id}/products/products/?${params.toString()}`;
  }, [page, category, search, selectedShop?.id]);

  const {
    data: fetchedData,
    isLoading,
    isError,
    refetch,
  } = useFetch<PaginatedProductType>(productsUrl);

  const [products, setProducts] = useState<PaginatedProductType>({
    results: [],
    count: 0,
  });

  useEffect(() => {
    if (fetchedData) setProducts(fetchedData);
  }, [fetchedData]);

  useEffect(() => {
    const params = new URLSearchParams(queryParamsString);
    page === 1 ? params.delete("page") : params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [page, pathname, queryParamsString, router]);

  const categorySearchEndpoint = useMemo(
    () => (q: string) =>
      `${selectedShop?.id}/search/category/?query=${encodeURIComponent(q)}`,
    [selectedShop?.id],
  );

  async function reqExportExcel() {
    try {
      const { status, data } = await useCrud.create<ExportProductsType>({
        url: `${selectedShop?.id}/products/export/create/`,
        data: {},
      });

      if (status === 202) {
        notify.success(
          `${t("product.messages.task_created")} ${data.task_id}`,
          {
            action: {
              label: t("product.messages.open"),
              onClick: () => router.push(`/${role}/products/exports`),
            },
          },
        );
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  return (
    <>
      <Header
        actions={
          <>
            <Button variant="link" size="sm" asChild>
              <Link href={`/${role}/products/create`}>
                {t("product.actions.create_product")}
              </Link>
            </Button>
            <Button onClick={reqExportExcel} size={`sm`} variant={`secondary`}>
              {t("product.actions.export")}
            </Button>
          </>
        }
      />

      <div className="flex mb-4 gap-x-2 flex-wrap">
        <Input
          className="md:w-96 w-full"
          type="search"
          value={search}
          placeholder={`${t("product.place_holders.search")} ...`}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SearchableCombobox<CategoryType>
          endpoint={categorySearchEndpoint}
          value={category}
          setValue={setCategory}
          className="w-fit"
          title={t("product.place_holders.category")}
          mapData={(item) => ({
            label: item.name,
            value: item.id.toString(),
          })}
        />
      </div>

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <ProductsTable data={products.results} refetch={refetch} />

          <TablePagination
            count={products.count}
            setPage={setPage}
            page={page}
          />
        </div>
      )}
    </>
  );
};

export default Page;
