"use client";

import { useMemo } from "react";
import { GenericTable, TableColumn } from "@/components/table";
import { formatCurrencyPure } from "@/lib/currency";
import Image from "@/components/ui/image";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "@/stores/currency.store";
import { ProductSalesType } from "@/types/systems.type";
import { formatedDate } from "@/lib/utils";

export default function SalesProductTable({
  data,
  refetch,
}: {
  data: ProductSalesType[];
  refetch: () => void;
}) {
  const { t } = useTranslation("stocks");
  const { usd, currency } = useCurrencyStore();

  const columns: TableColumn<ProductSalesType>[] = useMemo(
    () => [
      {
        key: "images",
        label: t("sales.table.image"),
        render: (value, row) => {
          const img = row.product?.images?.[0]?.image;
          return img ? (
            <Image
              src={img || "/placeholder.svg?height=40&width=40"}
              alt={t("sales.table.product_image_alt", {
                name: row.product?.name || t("sales.table.product"),
              })}
              className="rounded-md object-cover size-18"
            />
          ) : (
            <div className="rounded-md flex items-center justify-center bg-primary-foreground object-cover size-18">
              <Package />
            </div>
          );
        },
      },
      {
        key: "name",
        label: t("sales.table.product_name"),
        render: (value, row) => row.product?.name,
      },
      {
        key: "unit_price",
        label: t("sales.table.unit_price"),
        render: (value, row) =>
          formatCurrencyPure({
            number: value,
            rate: Number(row.exchange_rate),
            appCurrency: currency,
          }),
      },
      {
        key: "quantity",
        label: t("sales.table.count"),
        render: (value) => value,
      },
      {
        key: "date",
        label: t("sales.table.date"),
        render: (value) => formatedDate(value),
      },
      {
        key: "total_price",
        label: t("sales.table.total"),
        render: (value, row) =>
          formatCurrencyPure({
            number: Number(value),
            rate: Number(row.exchange_rate),
            appCurrency: currency,
          }),
      },
      {
        key: "profit",
        label: t("sales.table.income"),
        render: (value, row) =>
          formatCurrencyPure({
            number: Number(value),
            rate: Number(row.exchange_rate),
            appCurrency: currency,
          }),
      },
    ],
    [usd, currency, t],
  );

  return (
    <GenericTable
      data={data}
      columns={columns}
      emptyMessage={t("sales.table.no_stocks")}
    />
  );
}
