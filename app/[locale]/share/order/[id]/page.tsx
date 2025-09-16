"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/use-fetch";
import { useParams } from "next/navigation";
import { CalendarDays, CreditCard, Package2, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatedDate, formatedPhoneNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loading } from "@/components/loading/loading";
import { Separator } from "@/components/ui/separator";
import { type DetailOrderType } from "@/types/orders.type";
import { formatCurrencyPure } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import LanguageToggle from "@/components/togglies/language.toggle";
import ThemeModeToggle from "@/components/togglies/theme.togglie";
import OrderPrint from "@/components/order-print";

const Page = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<DetailOrderType | null>(null);

  const { data, isLoading } = useFetch<DetailOrderType>(`share/order/${id}/`);

  useEffect(() => {
    if (!isLoading && data) {
      setOrder(data);
    }
  }, [data, isLoading]);

  const [search, setSearch] = useState<string>("");

  if (!order || isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  const filteredData = order.items.filter((item) =>
    item.product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {t("order")} #{order.id}
          </h1>
          <div className="flex items-center gap-x-2">
            <OrderPrint order={order} />
            <LanguageToggle />
            <ThemeModeToggle />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("customerDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className={`capitalize`}>
                  {order.first_name} {order.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formatedPhoneNumber(order.phone_number)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{formatedDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">
                  {t(`submit.${order.payment_type}_payment`)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between font-medium">
                <span>{t("totalPrice")}</span>
                <span>
                  {formatCurrencyPure({
                    currency: order.currency,
                    rate: Number(order.exchange_rate),
                    number: order.total_price,
                    appCurrency: "UZS",
                  })}
                </span>
              </div>

              <div className="flex justify-between font-medium">
                <span>{t("paidAmount")}</span>
                <span>
                  {formatCurrencyPure({
                    currency: order.currency,
                    rate: Number(order.exchange_rate),
                    number: Number(order.paid_amount),
                    appCurrency: "UZS",
                  })}
                </span>
              </div>

              <div className="flex justify-between font-medium">
                <span>{t("changeAmount")}</span>
                <span>
                  {formatCurrencyPure({
                    currency: order.currency,
                    rate: Number(order.exchange_rate),
                    number: Number(order.change_amount),
                    appCurrency: "UZS",
                  })}
                </span>
              </div>

              <div className="flex justify-between font-medium">
                <span>{t("paymentType")}</span>
                <span className="capitalize">
                  {t(`submit.${order.payment_type}_payment`)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("orderItems")}</CardTitle>
              <Package2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              value={search}
              placeholder={t("search")}
              onChange={(e) => setSearch(e.target.value)}
              type={"search"}
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("product")}</TableHead>
                  <TableHead className="text-right">{t("quantity")}</TableHead>
                  <TableHead className="text-right">{t("price")}</TableHead>
                  <TableHead className="text-right">{t("total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="capitalize flex items-center gap-2">
                      <Avatar className="h-10 rounded-lg w-10">
                        <AvatarImage
                          className="object-cover"
                          src={item.product?.images[0]?.image || ""}
                          alt={`${item.product?.name}-${item.id}`}
                        />
                        <AvatarFallback className="rounded-lg">
                          {item.product?.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {item.product?.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyPure({
                        currency: item.currency,
                        rate: Number(item.exchange_rate),
                        number: item.price,
                        appCurrency: "UZS",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyPure({
                        currency: item.currency,
                        rate: Number(item.exchange_rate),
                        number: Number(item.price) * item.quantity,
                        appCurrency: "UZS",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
