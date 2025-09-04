import React from "react";
import { useTranslation } from "react-i18next";
import { GenericTable, TableAction, TableColumn } from "@/components/table";
import { formatedPhoneNumber } from "@/lib/utils";
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
  const { currency, usd } = useCurrencyStore();
  const { selectedShop } = useStore();

  const formatMoney = (value: number, rate?: number) =>
    formatCurrencyPure({
      number: value,
      rate: rate ?? usd,
      appCurrency: currency,
    });

  const renderCurrencyBadge = (value: number, rate?: number) => (
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
      key: "name",
      label: t("loan_user.table.full_name"),
      render: (value, row) => (
        <p className={`capitalize`}>
          {row.first_name} {row.last_name}
        </p>
      ),
    },
    {
      key: "accepted",
      label: t("loan_user.table.accepted"),
      render: (value, row) => formatMoney(Number(value)),
    },
    {
      key: "transferred",
      label: t("loan_user.table.transferred"),
      render: (value, row) => renderCurrencyBadge(Number(value)),
    },
    {
      key: "balance",
      label: t("loan_user.table.balance"),
      render: (value, row) => renderCurrencyBadge(Number(value)),
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
        `${selectedShop?.id}/debt/debtors/${id}/`,
      );

      if (status === 204) {
        notify.success(t("messages.user_deleted_success", { id }));
        refetch();
      }
    } catch (error) {
      notify.error(t("messages.user_deleted_error", { id }));
      console.error(error);
    }
  }

  return (
    <GenericTable
      data={data}
      edit={false}
      columns={columns}
      actions={actions}
      url="transactions/user/"
      emptyMessage={t("loan_user.table.no_loans")}
    />
  );
};

export default TransactionsUserTable;
