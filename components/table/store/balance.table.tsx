import React from "react";
import { useTranslation } from "react-i18next";
import { GenericTable, TableColumn } from "@/components/table";
import { formatedDate } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currency.store";
import { formatCurrencyPure } from "@/lib/currency";
import { CashboxDocuments } from "@/types/store.type";
import { Badge } from "@/components/ui/badge";

const CashboxDocumentsTable = ({ data }: { data: CashboxDocuments[] }) => {
  const { t } = useTranslation();
  const { currency } = useCurrencyStore();

  const formatMoney = (value: number, rate: number) =>
    formatCurrencyPure({
      number: value,
      rate: rate,
      appCurrency: currency,
    });

  const columns: TableColumn<CashboxDocuments>[] = [
    {
      key: "id",
      label: t("cashbox.table.id"),
      render: (value) => <>#{value}</>,
    },
    {
      key: "created_at",
      label: t("cashbox.table.date"),
      render: (value) => formatedDate(value),
    },
    {
      key: "amount",
      label: t("cashbox.table.amount"),
      render: (value, row) => (
        <>{formatMoney(Number(value), Number(row.exchange_rate))}</>
      ),
    },
    {
      key: "direction",
      label: t("cashbox.table.direction"),
      render: (value) => (
        <Badge variant={value == "out" ? "destructive" : "secondary"}>
          {t(`cashbox.table.${value}`)}
        </Badge>
      ),
    },
  ];

  return (
    <GenericTable
      data={data}
      edit={false}
      columns={columns}
      emptyMessage={t("cashbox.table.no_documents")}
    />
  );
};

export default CashboxDocumentsTable;
