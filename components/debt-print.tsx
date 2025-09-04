"use client";

import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatedDate, formatedPhoneNumber } from "@/lib/utils";
import { formatCurrencyPure } from "@/lib/currency";
import { useCurrencyStore } from "@/stores/currency.store";
import { useTranslation } from "react-i18next";
import { useStore } from "@/stores/store.store";
import type { TransactionDocumentType } from "@/types/transaction.type";
import CodeQR from "@/components/qr-code";

interface Props {
  document: TransactionDocumentType;
  locale?: any;
}

interface PrintableDebtDocumentProps {
  document: TransactionDocumentType;
  t: (key: string) => string;
}

const PrintableDebtDocument = ({ document, t }: PrintableDebtDocumentProps) => {
  const { usd } = useCurrencyStore();
  const { selectedShop } = useStore();

  const customerName =
    `${document.first_name || ""} ${document.last_name || ""}`.trim() ||
    formatedPhoneNumber(document.phone_number);

  const currencyFormat = useCallback(
    (number: string | number, exchange?: number): string | undefined =>
      formatCurrencyPure({
        number,
        currency: "USD",
        appCurrency: "UZS",
        rate: exchange ?? usd,
      }),
    [usd],
  );

  const url = `https://seller.svetafor.uz/share/transaction/${document.id}`;

  return (
    <div className="bg-white p-4 text-sm max-w-[210mm] mx-auto">
      <div className="flex justify-between items-start mb-4 pb-2 border-b">
        <div>
          <h1 className="text-lg font-bold">
            {t("check.document_number")} {document.id}
          </h1>
          <p className="text-xs">
            {t("check.date")}: {formatedDate(document.date)}
          </p>
        </div>
        <div className="text-right text-xs">
          {selectedShop?.name && (
            <div className="font-bold">{selectedShop.name}</div>
          )}
          {selectedShop?.phone_number && (
            <div>{formatedPhoneNumber(selectedShop.phone_number)}</div>
          )}
          <CodeQR logo={selectedShop?.logo} value={url} size={70} />
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs border p-2 rounded">
        <div>
          <div className="font-bold">{t("check.customer")}</div>
          <div>{customerName}</div>
        </div>
        <div>
          <div className="font-bold">{t("check.phone")}</div>
          <div>{formatedPhoneNumber(document.phone_number)}</div>
        </div>
      </div>

      {/* Products */}
      {document.products.length > 0 && (
        <table className="w-full border-collapse border mb-4 text-xs">
          <thead>
            <tr>
              <th className="border p-1 text-left">{t("check.product")}</th>
              <th className="border p-1 text-center w-16">
                {t("check.quantity")}
              </th>
              <th className="border p-1 text-right w-20">{t("check.price")}</th>
              <th className="border p-1 text-right w-24">{t("check.total")}</th>
            </tr>
          </thead>
          <tbody>
            {document.products.map((p) => (
              <tr key={p.id}>
                <td className="border p-1">
                  {t("check.product")} #{p.product}
                </td>
                <td className="border p-1 text-center">{p.quantity}</td>
                <td className="border p-1 text-right">
                  {currencyFormat(p.price, Number(p.exchange_rate))}
                </td>
                <td className="border p-1 text-right font-bold">
                  {currencyFormat(p.amount, Number(p.exchange_rate))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Summary */}
      <table className="w-full border mb-3 text-xs">
        <tbody>
          <tr>
            <td className="border-r p-2 font-bold">
              {t("transaction.cash_amount")}
            </td>
            <td className="p-2 text-right">
              {currencyFormat(
                document.cash_amount,
                Number(document.exchange_rate),
              )}
            </td>
          </tr>
          <tr>
            <td className="border-r p-2 font-bold">
              {t("transaction.product_amount")}
            </td>
            <td className="p-2 text-right">
              {currencyFormat(
                document.product_amount,
                Number(document.exchange_rate),
              )}
            </td>
          </tr>
          <tr>
            <td className="border-r p-2 font-bold">
              {t("transaction.income")}
            </td>
            <td className="p-2 text-right">
              {currencyFormat(document.income, Number(document.exchange_rate))}
            </td>
          </tr>
          <tr>
            <td className="border-r p-2 font-bold">
              {t("transaction.total_amount")}
            </td>
            <td className="p-2 text-right font-bold">
              {currencyFormat(
                document.total_amount,
                Number(document.exchange_rate),
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="text-center text-xs pt-2 border-t">
        <div className="font-bold">{t("check.thank_you_message")}</div>
      </div>
    </div>
  );
};

export default function DebtDocumentPrint({ document, locale = "uz" }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(locale);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${t("check.document_number")}-${document.id}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          background: white !important;
        }
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return (
    <div>
      <Button onClick={handlePrint} variant="outline" size="sm">
        <Printer className="w-4 h-4" />
        {t("check.print")}
      </Button>

      <div className="print-area hidden" ref={printRef}>
        <PrintableDebtDocument document={document} t={t} />
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
