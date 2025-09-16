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
import { TransactionDocumentType } from "@/types/transaction.type";
import { useParams } from "next/navigation";
import { useDeleteStore } from "@/hooks/use-delete-store";
import { useShare } from "@/hooks/use-share";

const TransactionDocumentTable = ({
  data,
  refetch,
}: {
  data: TransactionDocumentType[];
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const { currency, usd } = useCurrencyStore();
  const { selectedShop } = useStore();
  const { id } = useParams<{ id: string }>();

  const { openModal, setRefetch } = useDeleteStore();

  const formatMoney = (value: number) =>
    formatCurrencyPure({
      number: value,
      rate: usd,
      appCurrency: currency,
    });

  const renderCurrencyBadge = (value: number) => (
    <Badge
      variant="outline"
      className={`font-bold ${value > 0 ? "text-green-600" : "text-destructive"}`}
    >
      {formatMoney(value)}
    </Badge>
  );

  const columns: TableColumn<TransactionDocumentType>[] = [
    {
      key: "id",
      label: t("document.table.id"),
      render: (value) => <>#{value}</>,
    },
    {
      key: "phone_number",
      label: t("document.table.phone_number"),
      render: (value) => <>{formatedPhoneNumber(value)}</>,
    },
    {
      key: "date",
      label: t("document.table.date"),
      render: formatedDate,
    },
    {
      key: "product_amount",
      label: t("document.table.product_amount"),
      render: (value, row) => formatMoney(Number(value)),
    },
    {
      key: "cash_amount",
      label: t("document.table.cash_amount"),
      render: (value, row) => renderCurrencyBadge(Number(value)),
    },
    {
      key: "total_amount",
      label: t("document.table.total_amount"),
      render: (value, row) => renderCurrencyBadge(Number(value)),
    },
    {
      key: "income",
      label: t("document.table.income"),
      render: (value, row) => formatMoney(Number(value)),
    },
    {
      key: "method",
      label: t("document.table.method.name"),
      render: (value, row) => (
        <Badge variant={value !== "transfer" ? "outline" : "destructive"}>
          {t(`document.table.method.${value}`)}
        </Badge>
      ),
    },
  ];

  const { setShare } = useShare();

  function shareDocument(id: number) {
    setShare({
      link: `/share/transaction/document/${id}`,
      open: true,
    });
  }
  const actions: TableAction<TransactionDocumentType>[] = [
    {
      label: t("document.table.share"),
      onClick: (document) => shareDocument(document.id),
    },
    {
      label: t("document.table.delete"),
      onClick: (document) => handleDelete(document.id, document.debtuser),
      variant: "destructive",
    },
  ];

  async function handleDelete(id: number, debtuser: number) {
    openModal(
      `${selectedShop?.id}/debt/debtors/${debtuser}/documents/${id}/`,
      true,
    );
    setRefetch(refetch);
  }

  return (
    <GenericTable
      data={data}
      edit={false}
      columns={columns}
      actions={actions}
      url={`${id}/document/`}
      emptyMessage={t("document.table.no_documents")}
    />
  );
};

export default TransactionDocumentTable;
