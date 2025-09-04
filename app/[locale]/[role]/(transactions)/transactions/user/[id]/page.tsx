"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { useParams, useSearchParams } from "next/navigation";
import { TransactionDocumentType } from "@/types/transaction.type";
import { Loading } from "@/components/loading/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransactionDocumentTable from "@/components/table/transactions/documents.table";
import TablePagination from "@/components/table/pagination.table";
import { useDebtForm } from "@/hooks/use-debt";
import DebtDocumentCashFormModal from "@/components/modals/debt/debt-document-cash-form.modal";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { selectedShop } = useStore();
  const { role } = useUserStore();
  const { id } = useParams<{ id: string }>();

  const [documents, setDocuments] = useState<{
    results: TransactionDocumentType[];
    count: number;
  }>({
    results: [],
    count: 1,
  });

  const { setDOpen, setRefetch } = useDebtForm();

  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const param = searchParams.get("page");
    return param ? parseInt(param, 10) : 1;
  });

  const productsUrl = useMemo(() => {
    if (!selectedShop?.id) return "";

    const params = new URLSearchParams();
    params.set("page", page.toString());

    return `${selectedShop.id}/debt/debtors/${id}/documents/?${params.toString()}`;
  }, [page, selectedShop?.id]);

  const {
    data: fetchedData,
    isLoading,
    refetch,
  } = useFetch<{
    results: TransactionDocumentType[];
    count: number;
  }>(productsUrl);

  useEffect(() => {
    if (fetchedData && !isLoading) {
      setDocuments(fetchedData);
    }
  }, [fetchedData, isLoading]);

  const { t } = useTranslation();

  function handleAdd() {
    setDOpen(true);
    setRefetch(refetch);
  }

  return (
    <>
      <Header
        actions={
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
              <Button size="sm">{t("document.create_button")}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleAdd}>
                {t("document.with_cash")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${role}/transactions/user/${id}/document/create`}>
                  {t("document.with_product")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <DebtDocumentCashFormModal />

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <div>
          <TransactionDocumentTable
            data={documents.results}
            refetch={refetch}
          />

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
