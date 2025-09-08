"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/stores/order.store";
import { useCurrencyStore } from "@/stores/currency.store";
import Modal from "@/components/modals/index";
import { Banknote, CreditCard } from "lucide-react";
import { OrderFormType } from "@/types/orders.type";
import { Label } from "@/components/ui/label";
import PhoneNumber from "@/components/ui/phone-number";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrencyPure, unFormatCurrencyPure } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency } from "@/types/products.type";
import PriceInput from "@/components/ui/price-input";
import { checkRole, normalizeNumber } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";
import { notify } from "@/lib/toast";
import { logger } from "workbox-core/_private";

const OrderSubmitModal = () => {
  const {
    submitMode,
    setSubmitMode,
    order,
    setOrder,
    orderItems,
    resetOrder,
    setSearch,
  } = useOrder();
  const { usd, currency } = useCurrencyStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { t } = useTranslation();

  function handleChangeOrder<K extends keyof OrderFormType>(
    key: K,
    value: OrderFormType[K],
  ) {
    if (!order) return;

    setOrder({
      ...order,
      [key]: value,
    });
  }

  const { selectedShop } = useStore();

  async function handleSubmit() {
    const newErrors: { [key: string]: string } = {};

    if (!order?.phone_number?.trim()) {
      newErrors.phone_number = t("submit.errors.required_phone");
    }

    if (!order?.paid_amount || Number(order.paid_amount) <= 0) {
      newErrors.paid_amount = t("submit.errors.required_paid_amount");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...order,
      paid_amount: normalizeNumber(order.paid_amount),
      change_amount: normalizeNumber(order.change_amount),
      items: orderItems.map((item) => ({
        ...item,
        price: normalizeNumber(item.price),
      })),
    };

    try {
      const { status } = await useCrud.create({
        url: `${selectedShop?.id}/orders/orders/`,
        data: payload,
        ContentType: "application/json",
      });

      if (status === 201) {
        notify.success(t("order.create_success"));
        resetOrder();
        setSearch("");
        setTimeout(() => {
          useOrder.getState().searchRef?.current?.focus();
        }, 50);
        setErrors({});
      } else {
        notify.error(t("order.create_error"));
      }
    } catch (e) {
      logger.error(e);
      notify.error(t("order.create_error"));
    }
  }

  return (
    <Modal
      className={`md:p-6 overflow-hidden px-1 py-4 w-full max-h-full sm:max-w-[100%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] 3xl:max-w-[25%]`}
      open={submitMode}
      setOpen={() => {
        setSubmitMode(false);
      }}
      title={t("submit.title")}
      description={t("submit.description")}
      footer={
        <Button onClick={handleSubmit}>{t("submit.confirm_button")}</Button>
      }
    >
      <div className={`space-y-4`}>
        <div className={`border p-4 rounded-lg space-y-4`}>
          <CustomerUserCard errors={errors} />
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => handleChangeOrder("payment_type", "cash")}
              className={`border cursor-pointer rounded-lg hover:bg-primary transition-all duration-150 hover:text-primary-foreground p-4 flex flex-col items-center space-y-2 ${
                order.payment_type === "cash"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              <Banknote />
              {t("submit.cash_payment")}
            </div>
            <div
              onClick={() => handleChangeOrder("payment_type", "card")}
              className={`border cursor-pointer rounded-lg hover:bg-primary transition-all duration-150 hover:text-primary-foreground p-4 flex flex-col items-center space-y-2 ${
                order.payment_type === "card"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              <CreditCard />
              {t("submit.card_payment")}
            </div>
          </div>
        </div>

        <ChangeGivenPayment errors={errors} />

        <div className="border rounded-lg px-4">
          <Accordion type="single" collapsible>
            <AccordionItem className="border-none" value="item-1">
              <AccordionTrigger>{t("submit.order_details")}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="space-y-2 h-[20vh] flex-1 ">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 border-b justify-between"
                    >
                      <span className="font-bold">
                        {item.product_data.name}
                      </span>
                      <span className={`text-center`}>
                        {item.quantity} x{" "}
                        {formatCurrencyPure({
                          currency: item.currency,
                          number: Number(item.price),
                          appCurrency: currency,
                          rate: usd,
                        })}
                      </span>
                      <span className={`text-end`}>
                        {formatCurrencyPure({
                          currency: item.currency,
                          number: Number(item.price) * Number(item.quantity),
                          appCurrency: currency,
                          rate: usd,
                        })}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <Totals />
      </div>
    </Modal>
  );
};

export default OrderSubmitModal;

const ChangeGivenPayment = ({
  errors,
}: {
  errors: { [key: string]: string };
}) => {
  const { order, setOrder, orderItems } = useOrder();
  const { usd, currency } = useCurrencyStore();

  function handleChangeOrder<K extends keyof OrderFormType>(
    key: K,
    value: OrderFormType[K],
  ) {
    if (!order) return;

    setOrder({
      ...order,
      [key]: value,
    });
  }

  const total = orderItems.reduce((sum, item) => {
    return (
      sum +
      Number(
        typeof item.price === "string"
          ? item.price.replace(/,/g, ".")
          : item.price,
      ) *
        Number(item.quantity)
    );
  }, 0);

  const change =
    unFormatCurrencyPure({
      number: Number(
        typeof order.paid_amount === "string"
          ? order.paid_amount.replace(/,/g, ".")
          : order.paid_amount,
      ),
      currency: order.currency,
      appCurrency: currency,
      rate: usd,
    }) -
    unFormatCurrencyPure({
      number: Number(total),
      currency: "USD",
      appCurrency: currency,
      rate: usd,
    });

  useEffect(() => {
    if (change > 0) {
      handleChangeOrder("change_given", true);
    } else {
      handleChangeOrder("change_given", false);
      handleChangeOrder("change_amount", "");
    }
  }, [change]);

  const { t } = useTranslation();

  return (
    <div className={`border rounded-lg p-4 space-y-4`}>
      <div className={`flex items-center justify-between`}>
        <div className="w-[100px]">
          <Label htmlFor={`currency`} className="text-sm font-medium">
            {t("submit.currency_label")}
          </Label>
          <Select
            name="currency"
            value={order.currency}
            onValueChange={(e: Currency) => handleChangeOrder("currency", e)}
          >
            <SelectTrigger className="mt-2 w-fit">
              <SelectValue placeholder={t("submit.select_currency")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="UZS">UZS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={`w-full`}>
          <Label className={`text-sm font-medium`} htmlFor={`payment`}>
            {t("submit.payment_amount_label")} (
            {formatCurrencyPure({
              number: total,
              currency: "USD",
              appCurrency: order.currency,
              rate: usd,
            })}
            )
          </Label>
          <PriceInput
            name={"payment"}
            value={order.paid_amount}
            className={`form-input mt-2 ${
              errors.paid_amount
                ? "border border-red-500"
                : "border border-gray-300"
            }`}
            onValueChange={(value) =>
              handleChangeOrder("paid_amount", String(value))
            }
          />
        </div>
      </div>
      {errors.paid_amount && (
        <p className="text-red-500 text-sm mt-1">{errors.paid_amount}</p>
      )}
      {change > 0 && (
        <div className={`flex items-center justify-between`}>
          <div className="w-[100px]">
            <Label htmlFor={`currency`} className="text-sm font-medium">
              {t("submit.currency_label")}
            </Label>
            <Select
              name="currency_change"
              value={order.currency_change}
              onValueChange={(e: Currency) =>
                handleChangeOrder("currency_change", e)
              }
            >
              <SelectTrigger className="mt-2 w-fit">
                <SelectValue placeholder={t("submit.select_currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UZS">UZS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`w-full`}>
            <Label className={`text-sm font-medium`} htmlFor={`payment`}>
              {t("submit.change_amount_label")} (
              {formatCurrencyPure({
                number: change,
                currency: currency,
                appCurrency: order.currency_change,
                rate: usd,
              })}
              )
            </Label>
            <PriceInput
              className={`mt-2`}
              name={"currency_change"}
              value={order.change_amount}
              onValueChange={(value) =>
                handleChangeOrder("change_amount", String(value))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerUserCard = ({
  errors,
}: {
  errors: { [key: string]: string };
}) => {
  const { order, setOrder } = useOrder();

  function handleChangeOrder<K extends keyof OrderFormType>(
    key: K,
    value: OrderFormType[K],
  ) {
    if (!order) return;

    setOrder({
      ...order,
      [key]: value,
    });
  }

  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label>{t("submit.customer_phone_label")}</Label>
        <PhoneNumber
          className={`form-input ${
            errors.phone_number
              ? "border border-red-500"
              : "border border-gray-300"
          }`}
          onChange={(value: string) => handleChangeOrder("phone_number", value)}
          value={order.phone_number}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
        )}
      </div>
    </>
  );
};

const Totals = () => {
  const { role } = useUserStore();
  const { order, orderItems } = useOrder();
  const { usd, currency } = useCurrencyStore();

  const total = orderItems.reduce((sum, item) => {
    return (
      sum +
      Number(
        typeof item.price === "string"
          ? item.price.replace(/,/g, ".")
          : item.price,
      ) *
        Number(item.quantity)
    );
  }, 0);

  const payment =
    unFormatCurrencyPure({
      number: Number(
        typeof order.paid_amount === "string"
          ? order.paid_amount.replace(/,/g, ".")
          : order.paid_amount,
      ),
      currency: order.currency,
      appCurrency: currency,
      rate: usd,
    }) -
    unFormatCurrencyPure({
      number: Number(
        typeof order.change_amount === "string"
          ? order.change_amount.replace(/,/g, ".")
          : order.change_amount,
      ),
      currency: order.currency_change,
      appCurrency: currency,
      rate: usd,
    });

  const total_enter_price = orderItems.reduce((sum, item) => {
    return (
      sum +
      unFormatCurrencyPure({
        number: Number(item.product_data.enter_price),
        currency: item.product_data.currency,
        appCurrency: currency,
        rate: usd,
      }) *
        Number(item.quantity)
    );
  }, 0);

  const income = payment - total_enter_price;
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg p-4">
      <div className="space-y-1.5">
        <div className="flex justify-between text-muted-foreground">
          <span>{t("submit.payment_summary_payment")}</span>
          <span>
            {formatCurrencyPure({
              number: Number(
                typeof order.paid_amount === "string"
                  ? order.paid_amount.replace(/,/g, ".")
                  : order.paid_amount,
              ),
              currency: order.currency,
              appCurrency: currency,
              rate: usd,
            })}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-muted-foreground">
          <span>{t("submit.payment_summary_change")}</span>
          <span>
            {formatCurrencyPure({
              number: Number(
                typeof order.change_amount === "string"
                  ? order.change_amount.replace(/,/g, ".")
                  : order.change_amount,
              ),
              currency: order.currency_change,
              appCurrency: currency,
              rate: usd,
            })}
          </span>
        </div>
        <Separator className="my-2" />
        {(checkRole(role) === "admin" || checkRole(role) === "manager") && (
          <>
            <div className="flex justify-between text-muted-foreground">
              <span>{t("submit.payment_summary_income")}</span>
              <span>
                {formatCurrencyPure({
                  number: income,
                  currency: currency,
                  appCurrency: currency,
                  rate: usd,
                })}
              </span>
            </div>
            <Separator className="my-2" />
          </>
        )}
        <div className="flex justify-between font-semibold">
          <span>{t("submit.payment_summary_total")}</span>
          <span>
            {formatCurrencyPure({
              number: total,
              currency: "USD",
              appCurrency: currency,
              rate: usd,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
