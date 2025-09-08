"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/stores/currency.store";
import Modal from "@/components/modals/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrencyPure, unFormatCurrencyPure } from "@/lib/currency";

import { checkRole, normalizeNumber } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";
import { notify } from "@/lib/toast";
import { logger } from "workbox-core/_private";
import { useDebtStore } from "@/stores/debt.store";
import { TransactionDocumentForm } from "@/types/transaction.type";
import { useParams } from "next/navigation";
import MethodForm from "@/components/form/debt/method.form";

const DebtSubmitModal = () => {
  const {
    submitMode,
    setSubmitMode,
    debt,
    setDebt,
    debtItems,
    resetDebt,
    setSearch,
  } = useDebtStore();
  const { id } = useParams<{ id: string }>();
  const { usd, currency } = useCurrencyStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { t } = useTranslation();

  function handleChangeDebt<K extends keyof TransactionDocumentForm>(
    key: K,
    value: TransactionDocumentForm[K],
  ) {
    if (!debt) return;

    setDebt({
      ...debt,
      [key]: value,
    });
  }

  const { selectedShop } = useStore();

  async function handleSubmit() {
    const newErrors: { [key: string]: string } = {};

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...debt,
      products: debtItems.map((item) => ({
        ...item,
        price: normalizeNumber(item.price),
      })),
    };

    setSearch("");

    try {
      const { status } = await useCrud.create({
        url: `${selectedShop?.id}/debt/debtors/${id}/documents/`,
        data: payload,
      });

      if (status === 201) {
        notify.success(t("debt.create_success"));
        resetDebt();
        setErrors({});
        setTimeout(() => {
          useDebtStore.getState().searchRef?.current?.focus();
        }, 50);
      } else {
        notify.error(t("debt.create_error"));
      }
    } catch (e) {
      logger.error(e);
      console.log(e);
      notify.error(t("debt.create_error"));
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
        <MethodForm
          value={debt.method}
          setValue={(e) => handleChangeDebt("method", e)}
        />
        <div className="border rounded-lg px-4">
          <Accordion type="single" collapsible>
            <AccordionItem className="bdebt-none" value="item-1">
              <AccordionTrigger>{t("submit.debt_details")}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="space-y-2 h-[20vh] flex-1 ">
                  {debtItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 bdebt-b justify-between"
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

export default DebtSubmitModal;

const Totals = () => {
  const { role } = useUserStore();
  const { debt, debtItems } = useDebtStore();
  const { usd, currency } = useCurrencyStore();

  const total = debtItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const total_enter_price = debtItems.reduce((sum, item) => {
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

  const income = total - total_enter_price;

  const { t } = useTranslation();

  return (
    <div className="bdebt rounded-lg p-4">
      <div className="space-y-1.5">
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
