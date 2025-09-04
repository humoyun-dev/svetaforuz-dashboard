"use client";

import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { ListProductType } from "@/types/products.type";
import { formatCurrencyPure } from "@/lib/currency";
import Image from "@/components/ui/image";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "@/stores/currency.store";
import { useDebtStore } from "@/stores/debt.store";

export default function ProductsTable({
  data,
}: {
  data: ListProductType[];
  refetch?: () => void;
}) {
  const { t } = useTranslation();
  const { usd, currency } = useCurrencyStore();
  const { setDebtItem, setAddMode, debtItems } = useDebtStore();

  const isSelected = (productId: number) => {
    return debtItems.some((item) => item.product === productId);
  };

  function addDebtItem(product: ListProductType) {
    if (isSelected(product.id)) return;
    setAddMode(true);
    setDebtItem({
      product: product.id,
      product_data: product,
      currency: product.currency,
      price: product.out_price,
      quantity: "1",
    });
  }

  const columns: TableColumn<ListProductType>[] = [
    {
      key: "images",
      label: t("product.table.image"),
      render: (value) => {
        const img = value?.[0]?.image;
        return (
          <>
            {img ? (
              <Image
                src={img || "/placeholder.svg?height=40&width=40"}
                alt={`${value?.[0]?.id || "placeholder"}:${img || "placeholder"}`}
                className="rounded-md object-cover size-18"
              />
            ) : (
              <div
                className={`rounded-md flex items-center justify-center bg-primary-foreground object-cover size-18`}
              >
                <Package />
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "name",
      label: t("product.table.product_name"),
    },
    {
      key: "category",
      label: t("product.table.category"),
    },
    {
      key: "enter_price",
      label: t("product.table.enter_price"),
      render: (value) =>
        formatCurrencyPure({
          number: value,
          rate: usd,
          appCurrency: currency,
        }),
    },
    {
      key: "out_price",
      label: t("product.table.out_price"),
      render: (value) =>
        formatCurrencyPure({
          number: value,
          rate: usd,
          appCurrency: currency,
        }),
    },
    {
      key: "count",
      label: t("product.table.count"),
      render: (value) => value,
    },
    {
      key: "warehouse_count",
      label: t("product.table.warehouse_count"),
      render: (value) => value,
    },
  ];

  const actions: TableAction<ListProductType>[] = [
    {
      label: t("product.table.add"),
      onClick: addDebtItem,
      isDisabled: (row) => isSelected(row.id),
    },
  ];

  return (
    <>
      <GenericTable
        data={data}
        columns={columns}
        actions={actions}
        emptyMessage={t("product.table.no_products")}
      />
    </>
  );
}
