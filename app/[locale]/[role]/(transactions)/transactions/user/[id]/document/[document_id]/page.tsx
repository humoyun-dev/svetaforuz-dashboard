"use client";
import Header from "@/components/header";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { TransactionDocumentDetailType } from "@/types/transaction.type";
import { useStore } from "@/stores/store.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CreditCardIcon,
  PhoneIcon,
  UserIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  Box,
} from "lucide-react";
import { useCurrencyStore } from "@/stores/currency.store";
import { formatCurrencyPure } from "@/lib/currency";
import { formatedDate, formatedPhoneNumber } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/loading/loading";
import Image from "next/image";
import DebtDocumentPrint from "@/components/debt-print";

const Page = () => {
  const { selectedShop } = useStore();
  const { document_id, id } = useParams<{ document_id: string; id: string }>();

  const { data: transaction, isLoading } =
    useFetch<TransactionDocumentDetailType>(
      `${selectedShop?.id}/debt/debtors/${id}/documents/${document_id}/`,
    );

  const { t } = useTranslation();

  if (isLoading || !transaction) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header actions={<DebtDocumentPrint document={transaction} />} />
      <div className="px-4 py-6 min-h-screen">
        <TransactionDocumentDetails transaction={transaction} />
      </div>
    </>
  );
};

export default Page;

const TransactionDocumentDetails = ({
  transaction,
}: {
  transaction: TransactionDocumentDetailType;
}) => {
  const { usd, currency: appCurrency } = useCurrencyStore();
  const { t } = useTranslation();

  const formatCurrency = (price: string | number) =>
    formatCurrencyPure({
      number: Number(price),
      currency: "USD",
      rate: usd,
      appCurrency,
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {transaction.products.length > 0 && (
            <Card className="shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <ShoppingCartIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {t("transaction.products")}
                  <Badge variant="secondary" className="ml-auto">
                    {transaction.products.length}{" "}
                    {transaction.products.length === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transaction.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-5 border rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden bg-muted">
                          {product.product.images.length > 0 ? (
                            <Image
                              src={product.product.images[0].thumbnail}
                              alt={product.product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <Box />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <p className="font-medium text-xl leading-tight">
                              {product.product.name}
                            </p>
                            {product.product.barcode && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {product.product.barcode}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>
                              {t("transaction.quantity")}:{" "}
                              <span className="font-medium">
                                {product.quantity}
                              </span>
                            </span>
                            <span>×</span>
                            <span className="font-medium">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-primary">
                          {formatCurrency(product.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                {t("transaction.customer_info")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg">
                    {transaction.first_name} {transaction.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("transaction.customer_name")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">
                    {formatedPhoneNumber(transaction.phone_number)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("transaction.phone_number")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <CreditCardIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                {t("transaction.info")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <CalendarIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">
                    {formatedDate(transaction.date)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("transaction.date")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <DollarSignIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">
                    1 USD ={" "}
                    {Number.parseFloat(
                      transaction.exchange_rate,
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("transaction.exchange_rate")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <TrendingUpIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {t("transaction.financial_summary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("transaction.cash_amount")}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(transaction.cash_amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("transaction.product_amount")}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(transaction.product_amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground text-sm font-medium">
                    {t("transaction.income")}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(transaction.income)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <span className="font-bold text-lg">
                  {t("transaction.total_amount")}
                </span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(transaction.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
