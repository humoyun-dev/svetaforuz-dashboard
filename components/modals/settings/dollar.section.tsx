"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import PriceInput from "@/components/ui/price-input";
import { useCurrencyStore } from "@/stores/currency.store";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@/components/ui/button";
import { normalizeNumber } from "@/lib/utils";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useTranslation } from "react-i18next";

const DollarSection = () => {
  const { t } = useTranslation();
  const { usd, setUsd } = useCurrencyStore();
  const { role, user } = useUserStore();
  const { update } = useCrud;

  const [rate, setRate] = useState<string>(String(usd));

  const normalizedRate = useMemo(() => normalizeNumber(rate), [rate]);
  const isDisabled = useMemo(() => {
    return role !== "admin" || Number(normalizedRate) === usd;
  }, [role, normalizedRate, usd]);

  const handleSubmit = async () => {
    try {
      const { status } = await update({
        url: `user/rates/${user?.id}/`,
        data: {
          rate: Number(normalizedRate),
        },
      });

      if (status === 200) {
        notify.success(t("dollar.success"));
        setUsd(Number(normalizedRate));
        setRate(rate);
      }
    } catch (error) {
      console.error("Rate update error:", error);
      notify.error(t("dollar.error"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">{t("dollar.title")}</Label>
        <p className="text-sm text-muted-foreground">
          {t("dollar.description")}
        </p>
      </div>
      <div className="flex items-center justify-between gap-x-2">
        <PriceInput
          value={rate}
          disabled={role !== "admin"}
          onValueChange={(value) => setRate(String(value))}
        />
        <Button disabled={isDisabled} onClick={handleSubmit}>
          {t("dollar.update_button")}
        </Button>
      </div>
    </div>
  );
};

export default DollarSection;
