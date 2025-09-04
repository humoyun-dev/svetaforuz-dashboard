"use client";
import React, { useState } from "react";
import { useDebtForm } from "@/hooks/use-debt";
import Modal from "@/components/modals";
import { Label } from "@/components/ui/label";
import PriceInput from "@/components/ui/price-input";
import { TransactionDocumentForm } from "@/types/transaction.type";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/lib/constants";
import { Currency } from "@/types/products.type";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import MethodForm from "@/components/form/debt/method.form";
import { notify } from "@/lib/toast";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";

const DebtDocumentCashFormModal = () => {
  const { setDOpen, dOpen } = useDebtForm();
  const { id } = useParams<{ id: string }>();
  const { selectedShop } = useStore();
  const { t } = useTranslation();

  const initialForm: TransactionDocumentForm = {
    cash_amount: "",
    currency: "USD",
    method: "transfer",
    owner: Number(id),
    products: [],
  };

  const [form, setForm] = useState<TransactionDocumentForm>(initialForm);

  async function handleSubmit() {
    try {
      const { status } = await useCrud.create({
        url: `${selectedShop?.id}/debt/debtors/${id}/documents/`,
        data: form,
      });

      if (status === 201) {
        notify.success(t("debt.cash_document_created"));
        handleCancel();
      }
    } catch {
      notify.error(t("common.error"));
    }
  }

  function handleCancel() {
    setDOpen(false);
    setForm(initialForm);
  }

  return (
    <Modal
      title={t("debt.cash_document")}
      setOpen={handleCancel}
      open={dOpen}
      footer={<Button onClick={handleSubmit}>{t("common.create")}</Button>}
    >
      <MethodForm
        value={form.method}
        setValue={(e) => setForm({ ...form, method: e })}
      />

      <div className="flex gap-2 items-center justify-center w-full">
        <div className="space-y-2 w-[100px]">
          <Label htmlFor="currency">{t("product.price.currency")}</Label>
          <Select
            onValueChange={(value) =>
              setForm({ ...form, currency: value as Currency })
            }
            defaultValue={form.currency || "USD"}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("product.price.currencyPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="cash_amount">{t("product.price.label")}</Label>
          <PriceInput
            name="cash_amount"
            value={form.cash_amount}
            onValueChange={(value) =>
              setForm({ ...form, cash_amount: String(value) })
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default DebtDocumentCashFormModal;
