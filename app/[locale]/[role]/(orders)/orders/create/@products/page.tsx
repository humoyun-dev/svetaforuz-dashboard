"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { useSearchParams } from "next/navigation";
import type { PaginatedProductType } from "@/types/products.type";
import TablePagination from "@/components/table/pagination.table";
import ProductsTable from "@/components/table/orders/products.table";
import { Loading } from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/stores/order.store";
import { useTranslation } from "react-i18next";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Page = () => {
  const { orderItems, search, setSearch, setSearchRef, searchRef } = useOrder();
  const [products, setProducts] = useState<PaginatedProductType>({
    count: 0,
    results: [],
  });
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? Number.parseInt(param, 10) : 1;
  });
  const { selectedShop } = useStore();

  const productsUrl = useMemo(() => {
    if (!selectedShop?.id) return "";

    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    return `${selectedShop.id}/products/products/?${params.toString()}`;
  }, [page, debouncedSearch, selectedShop?.id]);

  const { data, isLoading } = useFetch<PaginatedProductType>(productsUrl);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setPage(1);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchRef(searchInputRef);
  }, [setSearchRef]);

  const cartItemsCount = orderItems.length;
  const hasResults = products.results.length > 0;
  const hasSearch = debouncedSearch.length > 0;

  return (
    <div className="flex bg-background flex-col h-full">
      <div className="flex  sticky top-0 pt-4 z-50 bg-background flex-col gap-4 pb-4 ">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder")}
              className="pl-9 pr-10"
              value={search}
              autoFocus={true}
              type="text"
              ref={searchInputRef}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              >
                ×
              </Button>
            )}
          </div>
          {/*<Button*/}
          {/*  variant="outline"*/}
          {/*  size="sm"*/}
          {/*  className="flex items-center gap-2 bg-transparent"*/}
          {/*>*/}
          {/*  <Filter className="h-4 w-4" />*/}
          {/*  Filters*/}
          {/*</Button>*/}
        </div>

        {hasSearch && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {isLoading
                ? t("search.searching")
                : t("search.results", {
                    count: products.count,
                    search: debouncedSearch,
                  })}
            </span>
            {!isLoading && products.count > 0 && (
              <Button variant="link" size="sm" onClick={handleClearSearch}>
                {t("search.clear")}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {isLoading && <Loading className="h-full" />}

        {!isLoading && !hasResults && hasSearch && (
          <EmptySearchResults
            search={debouncedSearch}
            onClear={handleClearSearch}
          />
        )}

        {!isLoading && !hasResults && !hasSearch && <EmptyProducts />}

        {!isLoading && hasResults && (
          <ScrollArea className="h-full">
            <div className="p-2">
              <ProductsTable data={products.results} />
              <div className="mt-6">
                <TablePagination
                  count={products.count}
                  setPage={setPage}
                  page={page}
                />
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default Page;

const EmptySearchResults = ({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t("search.notFoundTitle")}
      </h3>
      <p className="text-gray-500 mb-4 max-w-sm">
        {t("search.notFoundDescription", { search })}
      </p>
      <Button variant="outline" onClick={onClear}>
        {t("search.clear")}
      </Button>
    </div>
  );
};

const EmptyProducts = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t("search.noProductsTitle")}
      </h3>
      <p className="text-gray-500 mb-4 max-w-sm">
        {t("search.noProductsDescription")}
      </p>
      <Button variant="outline">{t("search.addProduct")}</Button>
    </div>
  );
};
