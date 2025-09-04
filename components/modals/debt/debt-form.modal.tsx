"use client";

import React from "react";
import Modal from "@/components/modals";
import { useDebtForm } from "@/hooks/use-debt";
import { Label } from "@/components/ui/label";
import PhoneNumber from "@/components/ui/phone-number";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";

const StoreFormModal = () => {
  const { setOpen, open, form, setForm, refetch } = useDebtForm();
  const { t } = useTranslation();
  const { selectedShop } = useStore();

  function handleCancel() {
    setOpen(false);
    setForm({
      phone_number: "",
      first_name: "",
      last_name: "",
    });
  }

  async function handleSubmit() {
    try {
      const { status } = await useCrud.create({
        url: `${selectedShop?.id}/debt/debtors/`,
        data: form,
      });

      if (status === 201) {
        notify.success(t("messages.user_created_success"));
        handleCancel();
        if (refetch) {
          refetch();
        }
      }
    } catch (error) {
      notify.error(t("messages.user_created_error"));
    }
  }

  return (
    <Modal
      className="md:p-6 overflow-hidden px-1 py-4 w-full max-h-full sm:max-w-[100%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] 3xl:max-w-[25%]"
      open={open}
      setOpen={handleCancel}
      title={t("form.user.create")}
      footer={<Button onClick={handleSubmit}>{t("form.actions.save")}</Button>}
    >
      <>
        <div className="grid space-y-2">
          <Label htmlFor="phone_number">{t("form.fields.phone_number")}</Label>
          <PhoneNumber
            id="phone_number"
            value={form.phone_number || ""}
            onChange={(phone) => setForm({ ...form, phone_number: phone })}
            placeholder={t("form.placeholders.phone_number")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid space-y-2">
            <Label htmlFor="first_name">{t("form.fields.first_name")}</Label>
            <Input
              id="first_name"
              name="first_name"
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder={t("form.placeholders.first_name")}
            />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="last_name">{t("form.fields.last_name")}</Label>
            <Input
              id="last_name"
              name="last_name"
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder={t("form.placeholders.last_name")}
            />
          </div>
        </div>
      </>
    </Modal>
  );
};

export default StoreFormModal;
