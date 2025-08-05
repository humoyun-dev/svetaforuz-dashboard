"use client";

import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { ListProductType } from "@/types/products.type";
import { formatCurrencyPure } from "@/lib/currency";
import Image from "@/components/ui/image";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/stores/store.store";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useCurrencyStore } from "@/stores/currency.store";

export default function ProductsTable({
  data,
  refetch,
}: {
  data: ListProductType[];
  refetch: () => void;
}) {
  const { t } = useTranslation();
  const { usd, currency } = useCurrencyStore();

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
    {
      key: "remainder",
      label: t("product.table.remainder"),
      render: (value) =>
        formatCurrencyPure({
          number: value,
          rate: usd,
          appCurrency: currency,
        }),
    },
  ];

  const actions: TableAction<ListProductType>[] = [
    {
      label: t("product.table.duplicate"),
      onClick: (product) => console.log("Duplicate product:", product),
    },
    {
      label: t("product.table.delete"),
      onClick: (product) => handleDelete(product.id),
      variant: "destructive",
    },
  ];

  const { selectedShop } = useStore();

  async function handleDelete(id: number) {
    try {
      const { status } = await useCrud.delete(
        `${selectedShop?.id}/products/products/${id}/`,
      );

      if (status == 204) {
        notify.success(`Successfully deleted #${id} order`);
        refetch();
      }
    } catch (error) {
      notify.error(`Unsuccessfully deleted #${id} order`);
      console.error(error);
    }
  }

  return (
    <>
      <GenericTable
        data={data}
        columns={columns}
        actions={actions}
        url={`products/`}
        emptyMessage={t("product.table.no_products")}
      />
    </>
  );
}
