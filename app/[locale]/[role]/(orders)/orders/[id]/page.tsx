"use client";
import { useParams, useRouter } from "next/navigation";
import { memo, useMemo, useCallback } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStore } from "@/stores/store.store";
import { useUserStore } from "@/stores/user.store";
import { useCurrencyStore } from "@/stores/currency.store";
import { notify } from "@/lib/toast";
import { formatCurrencyPure } from "@/lib/currency";
import { useCrud } from "@/hooks/use-crud";
import useFetch from "@/hooks/use-fetch";
import type { DetailOrderType } from "@/types/orders.type";
import { formatedDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Header from "@/components/header";
import { OrderDetailSkeleton } from "./components/order-detail-skeleton";
import { OrderDetailError } from "./components/order-detail-error";
import { ProductsTable } from "./components/products-table";
import { CustomerInfoCard } from "./components/customer-info-card";
import { PaymentInfoCard } from "./components/payment-info-card";
import { FinancialSummaryCard } from "./components/financial-summary-card";
import { OrderStatusCard } from "./components/order-status-card";
import OrderPrint from "@/components/order-print";

const OrderDetailPage = memo(() => {
  const { selectedShop } = useStore();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usd, currency } = useCurrencyStore();
  const { role } = useUserStore();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useFetch<DetailOrderType>(
    `${selectedShop?.id}/orders/orders/${id}/`,
  );

  const handleDelete = useCallback(async () => {
    try {
      const { status } = await useCrud.delete(
        `${selectedShop?.id}/orders/orders/${id}/`,
      );
      if (status === 204) {
        notify.success(t("order.delete_success"));
        router.push(`/${role}/orders/`);
      }
    } catch (error) {
      notify.error(t("order.delete_error"));
      console.error(error);
    }
  }, [selectedShop?.id, id, t, router, role]);

  const currencyFormat = useCallback(
    (number: string | number, exchange?: number): string | undefined =>
      formatCurrencyPure({
        number,
        currency: "USD",
        appCurrency: currency,
        rate: exchange ?? usd,
      }),
    [currency, usd],
  );

  const totalAmount = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.reduce(
      (sum, item) => sum + item.quantity * Number(item.price),
      0,
    );
  }, [data?.items]);

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        {data && <OrderPrint order={data} />}
        {data?.is_deleted && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t("order.status.deleted")}
          </Badge>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              {t("order.delete_button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("order.delete_dialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("order.delete_dialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                {t("order.delete_dialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
    [data?.is_deleted, t, handleDelete],
  );

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <OrderDetailError onBackClick={() => router.push(`/${role}/orders/`)} />
    );
  }

  return (
    <>
      <Header actions={headerActions} />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("order.title")} #{id}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("order.created_on")} {formatedDate(data.created_at)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductsTable
              items={data.items}
              totalAmount={totalAmount}
              exchangeRate={Number(data.exchange_rate)}
              currencyFormat={currencyFormat}
            />
          </div>

          <div className="space-y-6">
            <CustomerInfoCard
              firstName={data.first_name}
              lastName={data.last_name}
              phoneNumber={data.phone_number}
            />

            <PaymentInfoCard
              paymentType={data.payment_type}
              currency={data.currency}
              totalPrice={data.total_price}
              paidAmount={data.paid_amount}
              changeGiven={data.change_given}
              changeAmount={data.change_amount}
              exchangeRate={Number(data.exchange_rate)}
              currencyFormat={currencyFormat}
            />

            <FinancialSummaryCard
              totalProfit={data.total_profit}
              unreturnedIncome={data.unreturned_income}
              exchangeRate={data.exchange_rate}
              currencyFormat={currencyFormat}
            />

            <OrderStatusCard
              createdAt={data.created_at}
              isDeleted={data.is_deleted}
              deletedAt={data.deleted_at}
            />
          </div>
        </div>
      </div>
    </>
  );
});

OrderDetailPage.displayName = "OrderDetailPage";

export default OrderDetailPage;
