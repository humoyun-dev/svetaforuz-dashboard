"use client";

import { useCallback, useMemo } from "react";
import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { formatCurrencyPure } from "@/lib/currency";
import Image from "@/components/ui/image";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/stores/store.store";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useCurrencyStore } from "@/stores/currency.store";
import { StockEntryType } from "@/types/systems.type";
import { Badge } from "@/components/ui/badge";
import { formatedDate } from "@/lib/utils";

export default function StockEntryTable({
  data,
  refetch,
}: {
  data: StockEntryType[];
  refetch: () => void;
}) {
  const { t } = useTranslation("stocks");
  const { usd, currency } = useCurrencyStore();
  const { selectedShop } = useStore();

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const { status } = await useCrud.delete(
          `${selectedShop?.id}/system/product-entries/${id}/`,
        );

        if (status === 204) {
          notify.success(t("stock.messages.delete_success", { id }));
          refetch();
        }
      } catch (error) {
        notify.error(t("stock.messages.delete_error", { id }));
        console.error(error);
      }
    },
    [selectedShop?.id, refetch, t],
  );

  const columns: TableColumn<StockEntryType>[] = useMemo(
    () => [
      {
        key: "images",
        label: t("stock.table.image"),
        render: (value, row) => {
          const img = row.product?.images?.[0]?.image;
          return img ? (
            <Image
              src={img || "/placeholder.svg?height=40&width=40"}
              alt={t("stock.table.product_image_alt", {
                name: row.product?.name || t("stock.table.product"),
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
        label: t("stock.table.product_name"),
        render: (value, row) => row.product?.name,
      },
      {
        key: "unit_price",
        label: t("stock.table.unit_price"),
        render: (value) =>
          formatCurrencyPure({
            number: value,
            rate: usd,
            appCurrency: currency,
          }),
      },
      {
        key: "count",
        label: t("stock.table.count"),
        render: (value) => value,
      },
      {
        key: "date",
        label: t("stock.table.date"),
        render: (value) => formatedDate(value),
      },
      {
        key: "is_warehouse",
        label: t("stock.table.is_warehouse"),
        render: (value) => (
          <Badge variant={"outline"}>
            {value ? t("stock.table.in_warehouse") : t("stock.table.in_store")}
          </Badge>
        ),
      },
      {
        key: "total",
        label: t("stock.table.total"),
        render: (value, row) =>
          formatCurrencyPure({
            number: Number(row.unit_price) * row.count,
            rate: usd,
            appCurrency: currency,
          }),
      },
    ],
    [usd, currency, t],
  );

  const actions: TableAction<StockEntryType>[] = useMemo(
    () => [
      {
        label: t("stock.table.delete"),
        onClick: (stock) => handleDelete(stock.id),
        variant: "destructive",
      },
    ],
    [handleDelete, t],
  );

  return (
    <GenericTable
      data={data}
      columns={columns}
      actions={actions}
      emptyMessage={t("stock.table.no_stocks")}
    />
  );
}
