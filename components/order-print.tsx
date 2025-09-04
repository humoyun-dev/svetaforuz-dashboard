"use client";

import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import type { DetailOrderType } from "@/types/orders.type";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatedDate, formatedPhoneNumber } from "@/lib/utils";
import { formatCurrencyPure } from "@/lib/currency";
import { useCurrencyStore } from "@/stores/currency.store";
import CodeQR from "@/components/qr-code";
import { useTranslation } from "react-i18next";
import { useStore } from "@/stores/store.store";

interface Props {
  order: DetailOrderType;
  locale?: any;
}

interface PrintableOrderProps {
  order: DetailOrderType;
  t: (key: string) => string;
}

const PrintableOrder = ({ order, t }: PrintableOrderProps) => {
  const formattedDate = formatedDate(order.created_at);
  const { selectedShop } = useStore();
  const customerName =
    `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
    formatedPhoneNumber(order.phone_number);

  const date = new Date();
  const { usd } = useCurrencyStore();
  const url = `https://seller.svetafor.uz/share/order/${order.id}`;

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

  return (
    <div className="bg-white p-3 text-sm max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 pb-2 border-b ">
        <div className="flex-1">
          <h1 className="text-lg font-bold mb-1">
            {t("check.order_number")}
            {order.id}
          </h1>
          <div className="text-xs">
            {t("check.date")} {formattedDate} | {t("check.receipt_date")}{" "}
            {formatedDate(String(date))}
          </div>
        </div>
        <div className="ml-4">
          <CodeQR logo={selectedShop?.logo} value={url} size={70} />
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-xs border  p-2">
        <div>
          <div className="font-bold">{t("check.customer")}</div>
          <div>{customerName}</div>
        </div>
        <div>
          <div className="font-bold">{t("check.phone")}</div>
          <div>{formatedPhoneNumber(order.phone_number)}</div>
        </div>
        <div>
          <div className="font-bold">{t("check.payment_type")}</div>
          <div>{t(`submit.${order.payment_type}_payment`)}</div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border  mb-3">
        <thead>
          <tr>
            <th className="border  p-1 text-left text-xs font-bold w-16">
              {t("check.image")}
            </th>
            <th className="border  p-1 text-left text-xs font-bold">
              {t("check.product")}
            </th>
            <th className="border  p-1 text-center text-xs font-bold w-16">
              {t("check.quantity")}
            </th>
            <th className="border  p-1 text-right text-xs font-bold w-20">
              {t("check.price")}
            </th>
            <th className="border  p-1 text-right text-xs font-bold w-24">
              {t("check.total")}
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            const imgUrl = item.product.images[0]?.image;
            const itemTotal = Number.parseFloat(item.price) * item.quantity;
            return (
              <tr key={item.id}>
                <td className="border  p-1">
                  {imgUrl ? (
                    <div className="w-12 h-12 relative border ">
                      <Image
                        src={imgUrl || "/placeholder.svg"}
                        fill
                        alt={item.product.name}
                        className="object-cover"
                        sizes="48px"
                        priority
                        unoptimized
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 border  flex items-center justify-center text-xs">
                      {t("check.no_image")}
                    </div>
                  )}
                </td>
                <td className="border  p-1 text-xs">
                  <div className="font-bold">{item.product.name}</div>
                  <div className="text-xs">
                    {currencyFormat(item.price, Number(item.exchange_rate))}{" "}
                    {t("check.per_unit")}
                  </div>
                </td>
                <td className="border  p-1 text-center text-xs font-bold">
                  {item.quantity}
                </td>
                <td className="border  p-1 text-right text-xs">
                  {currencyFormat(item.price, Number(item.exchange_rate))}
                </td>
                <td className="border  p-1 text-right text-xs font-bold">
                  {currencyFormat(itemTotal, Number(item.exchange_rate))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <table className="w-full border  mb-3">
        <tbody>
          <tr>
            <td className="border-r  p-2 text-xs font-bold w-1/2">
              {t("check.total_price")}
            </td>
            <td className="p-2 text-right text-sm font-bold">
              {currencyFormat(order.total_price, Number(order.exchange_rate))}
            </td>
          </tr>
          <tr className="border-t ">
            <td className="border-r  p-2 text-xs font-bold">
              {t("check.paid_amount")}
            </td>
            <td className="p-2 text-right text-xs font-bold">
              {currencyFormat(order.paid_amount, Number(order.exchange_rate))}
            </td>
          </tr>
          {order.change_given && (
            <tr className="border-t ">
              <td className="border-r  p-2 text-xs font-bold">
                {t("check.change_amount")}
              </td>
              <td className="p-2 text-right text-xs font-bold">
                {currencyFormat(
                  order.change_amount,
                  Number(order.exchange_rate),
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-center text-xs border-t  pt-2">
        <div className="font-bold">{t("check.thank_you_message")}</div>
        {selectedShop?.phone_number && (
          <div>
            {t("check.questions_contact")}{" "}
            {formatedPhoneNumber(selectedShop.phone_number)}
          </div>
        )}
      </div>
    </div>
  );
};

export default function OrderPrint({ order, locale = "uz" }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(locale);

  const waitForImages = async () => {
    const container = printRef.current;
    if (!container) return;

    const imgs = Array.from(
      container.querySelectorAll("img"),
    ) as HTMLImageElement[];
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
      ),
    );
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${t("check.order_number")}-${order.id}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          color: black !important;
          background: white !important;
        }
        * {
          color: black !important;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table {
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
        img {
          page-break-inside: avoid;
        }
      }
    `,
    onBeforePrint: waitForImages,
  });

  return (
    <div>
      <Button onClick={handlePrint} variant="outline" size="sm">
        <Printer className="w-4 h-4" />
        {t("check.print")}
      </Button>

      <div className="print-area" ref={printRef}>
        <PrintableOrder order={order} t={t} />
      </div>

      <style jsx global>{`
        .print-area {
          display: none;
        }

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
