"use client";
import React, { useCallback, useMemo } from "react";
import Modal from "@/components/modals";
import { Button } from "@/components/ui/button";
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
import { Currency } from "@/types/products.type";
import { Minus, Plus } from "lucide-react";
import { checkRole } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import { useDebtStore } from "@/stores/debt.store";
import { TransactionDocumentProductForm } from "@/types/transaction.type";

const DebtItemModal = () => {
  const {
    addMode,
    setAddMode,
    setDebtItem,
    debtItem,
    addDebtItem,
    index,
    updateDebtItem,
    setSearch,
  } = useDebtStore();
  const { usd } = useCurrencyStore();
  const { role } = useUserStore();

  const { t } = useTranslation();

  function handleChangeDebtItem<K extends keyof TransactionDocumentProductForm>(
    key: K,
    value: TransactionDocumentProductForm[K],
  ) {
    const currentItem = debtItem;
    if (!currentItem) return;

    useDebtStore.getState().setDebtItem({
      ...currentItem,
      [key]: value,
    });
  }

  const updateQuantity = useCallback((quantity: number) => {
    handleChangeDebtItem("quantity", String(quantity));
  }, []);

  const formatCurrency = useMemo(() => {
    return (value: number) => {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: debtItem?.currency || "USD",
      });
    };
  }, [debtItem?.currency]);

  function handleAddToItems(item: TransactionDocumentProductForm) {
    if (typeof index === "number" && index >= 0) {
      updateDebtItem(index, item);
      setAddMode(false);
    } else {
      addDebtItem(item);
      setAddMode(false);
    }
    setSearch("");
    setTimeout(() => {
      useDebtStore.getState().searchRef?.current?.focus();
    }, 50);
  }

  if (!debtItem) return null;

  return (
    <Modal
      className={`md:p-6 overflow-hidden px-1 py-4 min-w-[60%]`}
      open={addMode}
      setOpen={() => {
        setAddMode(false);
        setDebtItem(null);
      }}
      title={t("product.table.title", {
        product: debtItem.product_data.name,
      })}
      description={t("product.table.description")}
      footer={
        <>
          <Button
            disabled={
              Number(debtItem.quantity) >=
              debtItem.product_data.count +
                debtItem.product_data.warehouse_count
            }
            variant="default"
            onClick={() => handleAddToItems(debtItem)}
          >
            {t("product.modal.save")}
          </Button>
        </>
      }
    >
      <>
        <div className="bdebt p-2 rounded-lg">
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
                      src={debtItem.product_data.images[0]?.image || ""}
                      alt={
                        debtItem.product_data.name + debtItem.product_data.id
                      }
                    />
                    <AvatarFallback className="rounded-lg uppercase">
                      {debtItem.product_data.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {debtItem.product_data.name}
                </TableCell>
                <TableCell className="capitalize">
                  {formatCurrencyPure({
                    currency: debtItem.product_data.currency,
                    number: Number(debtItem.product_data.enter_price),
                    appCurrency: debtItem.currency,
                    rate: usd,
                  })}
                </TableCell>

                <TableCell className="capitalize">
                  {formatCurrencyPure({
                    currency: debtItem.product_data.currency,
                    number: Number(debtItem.product_data.out_price),
                    appCurrency: debtItem.currency,
                    rate: usd,
                  })}
                </TableCell>

                <TableCell className="capitalize">
                  <Badge variant={"outline"}>
                    {debtItem.product_data.warehouse_count.toLocaleString()}-
                    {debtItem.product_data.count_type.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize text-right">
                  <Badge variant={"outline"}>
                    {debtItem.product_data.count.toLocaleString()}-
                    {debtItem.product_data.count_type.toLocaleUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="grid mt-3 bdebt rounded-lg gap-6 p-3">
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="w-[100px]">
              <Label className="text-sm font-medium">
                {t("product.table.currency")}
              </Label>
              <Select
                name="currency"
                value={debtItem.currency}
                onValueChange={(e: Currency) =>
                  handleChangeDebtItem("currency", e)
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
                    currency: debtItem.product_data.currency,
                    number: Number(debtItem.product_data.enter_price),
                    appCurrency: debtItem.currency,
                    rate: usd,
                  })}
                  )
                </span>
              </Label>
              <PriceInput
                onValueChange={(value, name, values) =>
                  handleChangeDebtItem("price", String(value))
                }
                className="mt-2"
                name="price"
                value={debtItem.price}
                placeholder={`${formatCurrencyPure({
                  currency: debtItem.product_data.currency,
                  number: Number(debtItem.price),
                  appCurrency: debtItem.currency,
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
                onClick={() => updateQuantity(Number(debtItem.quantity) - 1)}
                className="w-12"
                variant={"outline"}
                size={"icon"}
                disabled={Number(debtItem.quantity) <= 0}
              >
                <Minus />
              </Button>
              <PriceInput
                onValueChange={(value, name, values) =>
                  handleChangeDebtItem("quantity", String(value))
                }
                allowDecimals={false}
                name="quantity"
                value={debtItem.quantity}
              />
              <Button
                onClick={() => updateQuantity(Number(debtItem.quantity) + 1)}
                className="w-12"
                variant={"outline"}
                size={"icon"}
                disabled={
                  Number(debtItem.quantity) >=
                  debtItem.product_data.count +
                    debtItem.product_data.warehouse_count
                }
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-2 mt-4 bdebt rounded-lg">
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
                  {debtItem.product_data.name}
                </TableCell>
                <TableCell>{`${formatCurrency(
                  Number(
                    typeof debtItem.price === "string"
                      ? debtItem.price.replace(/,/g, ".")
                      : debtItem.price,
                  ),
                )} × ${debtItem.quantity}`}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    Number(debtItem.quantity) *
                      Number(
                        typeof debtItem.price === "string"
                          ? debtItem.price.replace(/,/g, ".")
                          : debtItem.price,
                      ),
                  )}
                </TableCell>
                {(checkRole(role) === "admin" ||
                  checkRole(role) == "manager") && (
                  <TableCell
                    className={`text-right font-medium ${
                      Number(debtItem.quantity) *
                        (Number(
                          typeof debtItem.price === "string"
                            ? debtItem.price.replace(/,/g, ".")
                            : debtItem.price,
                        ) -
                          Number(
                            unFormatCurrencyPure({
                              rate: usd,
                              currency: debtItem.product_data.currency,
                              appCurrency: debtItem.currency,
                              number: Number(debtItem.product_data.enter_price),
                            }),
                          )) >
                      0
                        ? "text-green-500"
                        : "text-destructive"
                    }`}
                  >
                    {formatCurrency(
                      Number(debtItem.quantity) *
                        (Number(
                          typeof debtItem.price === "string"
                            ? debtItem.price.replace(/,/g, ".")
                            : debtItem.price,
                        ) -
                          Number(
                            unFormatCurrencyPure({
                              rate: usd,
                              currency: debtItem.product_data.currency,
                              appCurrency: debtItem.currency,
                              number: Number(debtItem.product_data.enter_price),
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

export default DebtItemModal;
