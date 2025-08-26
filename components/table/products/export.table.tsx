"use client";

import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { ExportProductsType, ListProductType } from "@/types/products.type";
import { useTranslation } from "react-i18next";
import { formatedDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ExportTasksTable({
  data,
  refetch,
}: {
  data: ExportProductsType[];
  refetch: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const columns: TableColumn<ExportProductsType>[] = [
    {
      key: "task_id",
      label: t("export.table.task_id"),
    },
    {
      key: "created_at",
      label: t("export.table.created_at"),
      render: (value) => formatedDate(value),
    },
    {
      key: "status",
      label: t("export.table.status.name"),
      //   status: "PENDING" | "FAILED" | "PROCESSING" | "PROGRESS" | "SUCCESS";
      render: (value) => t(`export.table.status.${value}`),
    },
    {
      key: "completed_at",
      label: t("export.table.completed_at"),
      render: (value) => formatedDate(value),
    },
  ];

  const actions: TableAction<ExportProductsType>[] = [
    {
      label: t("export.table.download"),
      onClick: (product) => router.push(`${product.file_url}`),
      isDisabled: (row) => row.status !== "SUCCESS",
    },
  ];

  return (
    <>
      <GenericTable
        data={data}
        columns={columns}
        actions={actions}
        emptyMessage={t("export.table.no_tasks")}
      />
    </>
  );
}
