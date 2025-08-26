"use client";
import React from "react";
import Header from "@/components/header";
import useFetch from "@/hooks/use-fetch";
import { ExportProductsType } from "@/types/products.type";
import { useStore } from "@/stores/store.store";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/loading/loading";
import ExportTasksTable from "@/components/table/products/export.table";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";

const Page = () => {
  const { selectedShop } = useStore();
  const { t } = useTranslation("products");
  const router = useRouter();
  const { role } = useUserStore();

  const { safeData, isLoading, refetch } = useFetch<ExportProductsType[]>(
    `${selectedShop?.id}/products/export/logs/`,
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

      await refetch();
    } catch (error) {
      console.error("error", error);
    }
  }

  return (
    <>
      <Header
        actions={
          <Button onClick={reqExportExcel} size={`sm`} variant={`secondary`}>
            {t("product.actions.export")}
          </Button>
        }
      />

      {isLoading ? (
        <Loading className="h-[80vh]" />
      ) : (
        <ExportTasksTable refetch={refetch} data={safeData} />
      )}
    </>
  );
};

export default Page;
