import React from "react";
import { useTranslation } from "react-i18next";
import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { formatedPhoneNumber } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currency.store";
import { formatCurrencyPure } from "@/lib/currency";
import { StoreType } from "@/types/store.type";
import Image from "@/components/ui/image";
import { Store } from "lucide-react";
import { useDeleteStore } from "@/hooks/use-delete-store";
import { useStoreForm } from "@/hooks/use-store-form";

const StoreTable = ({ data }: { data: StoreType[] }) => {
  const { t } = useTranslation();
  const { currency } = useCurrencyStore();
  const { setOpen, setUrl } = useDeleteStore();
  const { setOpen: setOpenStore, setId } = useStoreForm();

  const formatMoney = (value: number, rate: number) =>
    formatCurrencyPure({
      number: value,
      rate: rate,
      appCurrency: currency,
    });

  const columns: TableColumn<StoreType>[] = [
    {
      key: "id",
      label: t("store.table.id"),
      render: (value) => <>#{value}</>,
    },
    {
      key: "logo",
      label: t("store.table.image"),
      render: (value) => {
        return (
          <>
            {value ? (
              <Image
                src={value || "/placeholder.svg?height=40&width=40"}
                alt={`${value || "placeholder"}:${value || "placeholder"}`}
                className="rounded-md object-cover size-18"
              />
            ) : (
              <div
                className={`rounded-md flex items-center justify-center bg-primary-foreground object-cover size-18`}
              >
                <Store />
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "name",
      label: t("store.table.name"),
      render: (value) => value,
    },
    {
      key: "phone_number",
      label: t("store.table.phone_number"),
      render: (value) => <>{value ? formatedPhoneNumber(value) : "-"}</>,
    },
    {
      key: "role",
      label: t("store.table.role"),
      render: (value) => t(`store.table.${value}`),
    },
  ];

  const actions: TableAction<StoreType>[] = [
    {
      label: t("store.edit"),
      onClick: (order) => handleOpen(order.id),
      variant: "default",
    },
    {
      label: t("store.table.delete"),
      onClick: (order) => handleDelete(order.id),
      variant: "destructive",
    },
  ];

  function handleOpen(id: number) {
    setOpenStore(true);
    setId(String(id));
  }

  function handleDelete(id: number) {
    setOpen(true);
    setUrl(`store/${id}/`);
  }

  return (
    <GenericTable
      data={data}
      edit={false}
      columns={columns}
      actions={actions}
      url="store/"
      emptyMessage={t("store.table.no_store")}
    />
  );
};

export default StoreTable;
