"use client";
import React, { useCallback, useMemo } from "react";
import Modal from "@/components/modals/index";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/stores/order.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrencyStore } from "@/stores/currency.store";
import { formatCurrencyPure, unFormatCurrencyPure } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PriceInput from "@/components/ui/price-input";
import type { OrderItemsFormType } from "@/types/orders.type";
import { Currency } from "@/types/products.type";
import { Minus, Plus } from "lucide-react";
import { checkRole } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";

const OrderItemModal = () => {
  const {
    addMode,
    setAddMode,
    setOrderItem,
    orderItem,
    addOrderItem,
    index,
    updateOrderItem,
    setSearch,
  } = useOrder();
  const { usd } = useCurrencyStore();
  const { role } = useUserStore();

  const { t } = useTranslation();

  function handleChangeOrderItem<K extends keyof OrderItemsFormType>(
    key: K,
    value: OrderItemsFormType[K],
  ) {
    const currentItem = orderItem;
    if (!currentItem) return;

    useOrder.getState().setOrderItem({
      ...currentItem,
      [key]: value,
    });
  }

  const updateQuantity = useCallback((quantity: number) => {
    handleChangeOrderItem("quantity", String(quantity));
  }, []);

  const formatCurrency = useMemo(() => {
    return (value: number) => {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: orderItem?.currency || "USD",
      });
    };
  }, [orderItem?.currency]);

  function handleAddToItems(item: OrderItemsFormType) {
    if (typeof index === "number" && index >= 0) {
      updateOrderItem(index, item);
      setAddMode(false);
    } else {
      addOrderItem(item);
      setAddMode(false);
    }
    setSearch("");
    setTimeout(() => {
      useOrder.getState().searchRef?.current?.focus();
    }, 50);
  }

  if (!orderItem) return null;

  return (
    <Modal
      className={`md:p-6 overflow-hidden px-1 py-4 min-w-[60%]`}
      open={addMode}
      setOpen={() => {
        setAddMode(false);
        setOrderItem(null);
      }}
      title={t("product.table.title", {
        product: orderItem.product_data.name,
      })}
      description={t("product.table.descreption")}
      footer={
        <>
          <Button
            disabled={
              Number(orderItem.quantity) >=
              orderItem.product_data.count +
                orderItem.product_data.warehouse_count
            }
            variant="default"
            onClick={() => handleAddToItems(orderItem)}
          >
            {t("product.modal.save")}
          </Button>
        </>
      }
    >
      <>
        <div className="border p-2 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("product.table.product_name")}</TableHead>
                <TableHead>{t("product.table.enter_price")}</TableHead>
                <TableHead>{t("product.table.out_price")}</TableHead>
                <TableHead>{t("product.table.warehouse_count")}</TableHead>
                <TableHead className="text-right">
                  {t("product.table.count")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="capitalize flex items-center gap-2">
                  <Avatar className="rounded-lg size-14 bg-secondary flex items-center justify-center">
                    <AvatarImage
                      className="rounded-lg object-cover"
                      src={orderItem.product_data.images[0]?.image || ""}
                      alt={
                        orderItem.product_data.name + orderItem.product_data.id
                      }
                    />
                    <AvatarFallback className="rounded-lg uppercase">
                      {orderItem.product_data.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {orderItem.product_data.name}
                </TableCell>
                <TableCell className="capitalize">
                  {formatCurrencyPure({
                    currency: orderItem.product_data.currency,
                    number: Number(orderItem.product_data.enter_price),
                    appCurrency: orderItem.currency,
                    rate: usd,
                  })}
                </TableCell>

                <TableCell className="capitalize">
                  {formatCurrencyPure({
                    currency: orderItem.product_data.currency,
                    number: Number(orderItem.product_data.out_price),
                    appCurrency: orderItem.currency,
                    rate: usd,
                  })}
                </TableCell>

                <TableCell className="capitalize">
                  <Badge variant={"outline"}>
                    {orderItem.product_data.warehouse_count.toLocaleString()}-
                    {orderItem.product_data.count_type.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize text-right">
                  <Badge variant={"outline"}>
                    {orderItem.product_data.count.toLocaleString()}-
                    {orderItem.product_data.count_type.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="grid mt-3 border rounded-lg gap-6 p-3">
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="w-[100px]">
              <Label className="text-sm font-medium">
                {t("product.table.currency")}
              </Label>
              <Select
                name="currency"
                value={orderItem.currency}
                onValueChange={(e: Currency) =>
                  handleChangeOrderItem("currency", e)
                }
              >
                <SelectTrigger className="mt-2 w-fit">
                  <SelectValue placeholder={`Select currency`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="UZS">UZS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium" htmlFor="price">
                {t("product.table.price")}
                <span className="text-muted-foreground">
                  (
                  {formatCurrencyPure({
                    currency: orderItem.product_data.currency,
                    number: Number(orderItem.product_data.enter_price),
                    appCurrency: orderItem.currency,
                    rate: usd,
                  })}
                  )
                </span>
              </Label>
              <PriceInput
                onValueChange={(value, name, values) =>
                  handleChangeOrderItem("price", String(value))
                }
                className="mt-2"
                name="price"
                value={orderItem.price}
                placeholder={`${formatCurrencyPure({
                  currency: orderItem.product_data.currency,
                  number: Number(orderItem.price),
                  appCurrency: orderItem.currency,
                  rate: usd,
                })}`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="quantity">
              {t("product.table.quantity")}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => updateQuantity(Number(orderItem.quantity) - 1)}
                className="w-12"
                variant={"outline"}
                size={"icon"}
                disabled={Number(orderItem.quantity) <= 0}
              >
                <Minus />
              </Button>
              <PriceInput
                onValueChange={(value, name, values) =>
                  handleChangeOrderItem("quantity", String(value))
                }
                allowDecimals={false}
                name="quantity"
                value={orderItem.quantity}
              />
              <Button
                onClick={() => updateQuantity(Number(orderItem.quantity) + 1)}
                className="w-12"
                variant={"outline"}
                size={"icon"}
                disabled={
                  Number(orderItem.quantity) >=
                  orderItem.product_data.count +
                    orderItem.product_data.warehouse_count
                }
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-2 mt-4 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%] font-medium">
                  {t("product.table.product_name")}
                </TableHead>
                <TableHead className="font-medium">
                  {t("product.table.quantity")}
                </TableHead>
                <TableHead className="font-medium text-right">
                  {t("product.table.amount")}
                </TableHead>
                {(checkRole(role) === "admin" ||
                  checkRole(role) == "manager") && (
                  <TableHead className="font-medium text-right">
                    {t("product.table.income")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {orderItem.product_data.name}
                </TableCell>
                <TableCell>{`${formatCurrency(
                  Number(
                    typeof orderItem.price === "string"
                      ? orderItem.price.replace(/,/g, ".")
                      : orderItem.price,
                  ),
                )} × ${orderItem.quantity}`}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    Number(orderItem.quantity) *
                      Number(
                        typeof orderItem.price === "string"
                          ? orderItem.price.replace(/,/g, ".")
                          : orderItem.price,
                      ),
                  )}
                </TableCell>
                {(checkRole(role) === "admin" ||
                  checkRole(role) == "manager") && (
                  <TableCell
                    className={`text-right font-medium ${
                      Number(orderItem.quantity) *
                        (Number(
                          typeof orderItem.price === "string"
                            ? orderItem.price.replace(/,/g, ".")
                            : orderItem.price,
                        ) -
                          Number(
                            unFormatCurrencyPure({
                              rate: usd,
                              currency: orderItem.product_data.currency,
                              appCurrency: orderItem.currency,
                              number: Number(
                                orderItem.product_data.enter_price,
                              ),
                            }),
                          )) >
                      0
                        ? "text-green-500"
                        : "text-destructive"
                    }`}
                  >
                    {formatCurrency(
                      Number(orderItem.quantity) *
                        (Number(
                          typeof orderItem.price === "string"
                            ? orderItem.price.replace(/,/g, ".")
                            : orderItem.price,
                        ) -
                          Number(
                            unFormatCurrencyPure({
                              rate: usd,
                              currency: orderItem.product_data.currency,
                              appCurrency: orderItem.currency,
                              number: Number(
                                orderItem.product_data.enter_price,
                              ),
                            }),
                          )),
                    )}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </>
    </Modal>
  );
};

export default OrderItemModal;
