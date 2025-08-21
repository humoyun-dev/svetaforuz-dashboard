import React from "react";
import { useTranslation } from "react-i18next";
import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { formatedDate, formatedPhoneNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";
import { notify } from "@/lib/toast";
import { useCurrencyStore } from "@/stores/currency.store";
import { formatCurrencyPure } from "@/lib/currency";
import { TransactionUserType } from "@/types/transaction.type";

const TransactionsUserTable = ({
  data,
  refetch,
}: {
  data: TransactionUserType[];
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const { currency } = useCurrencyStore();
  const { selectedShop } = useStore();

  const formatMoney = (value: number, rate: number) =>
    formatCurrencyPure({
      number: value,
      rate: rate,
      appCurrency: currency,
    });

  const renderCurrencyBadge = (value: number, rate: number) => (
    <Badge
      variant="outline"
      className={`font-bold ${value > 0 ? "text-green-600" : "text-destructive"}`}
    >
      {formatMoney(value, rate)}
    </Badge>
  );

  const columns: TableColumn<TransactionUserType>[] = [
    {
      key: "id",
      label: t("loan_user.table.id"),
      render: (value) => <>#{value}</>,
    },
    {
      key: "phone_number",
      label: t("loan_user.table.phone_number"),
      render: (value) => <>{formatedPhoneNumber(value)}</>,
    },
    {
      key: "created_at",
      label: t("loan_user.table.date"),
      render: formatedDate,
    },
    {
      key: "total_price",
      label: t("loan_user.table.total_price"),
      render: (value, row) =>
        formatMoney(Number(value), Number(row.exchange_rate)),
    },
    {
      key: "total_profit",
      label: t("loan_user.table.total_profit"),
      render: (value, row) =>
        renderCurrencyBadge(Number(value), Number(row.exchange_rate)),
    },
    {
      key: "paid_amount",
      label: t("loan_user.table.paid_amount"),
      render: (value, row) =>
        renderCurrencyBadge(Number(value), Number(row.exchange_rate)),
    },
    {
      key: "change_amount",
      label: t("loan_user.table.change_amount"),
      render: (value, row) =>
        formatMoney(Number(value), Number(row.exchange_rate)),
    },
    {
      key: "unreturned_income",
      label: t("loan_user.table.unreturned_income"),
      render: (value, row) => (
        <Badge variant={Number(value) > 0 ? "outline" : "destructive"}>
          {formatMoney(Number(value), Number(row.exchange_rate))}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<TransactionUserType>[] = [
    {
      label: t("loan_user.table.delete"),
      onClick: (user) => handleDelete(user.id),
      variant: "destructive",
    },
  ];

  async function handleDelete(id: number) {
    try {
      const { status } = await useCrud.delete(
        `${selectedShop?.id}/orders/orders/${id}/`,
      );

      if (status === 204) {
        notify.success(`Successfully deleted #${id} order`);
        refetch();
      }
    } catch (error) {
      notify.error(`Unsuccessfully deleted #${id} order`);
      console.error(error);
    }
  }

  return (
    <GenericTable
      data={data}
      edit={false}
      columns={columns}
      actions={actions}
      url="orders/"
      emptyMessage={t("loan_user.table.no_orders")}
    />
  );
};

export default TransactionsUserTable;
