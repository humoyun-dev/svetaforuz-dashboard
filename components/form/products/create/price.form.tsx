"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProductFormData,
  ProductEditData,
  CommonForm,
} from "@/lib/validation";
import { COUNT_TYPES, CURRENCIES } from "@/lib/constants";
import PriceInput from "@/components/ui/price-input";
import { useTranslation } from "react-i18next";

interface ProductPricingSectionProps {
  form?: UseFormReturn<ProductFormData>;
  editForm?: UseFormReturn<ProductEditData>;
  isEdit?: boolean;
}

export default function ProductPricingSection({
  form,
  editForm,
  isEdit = false,
}: ProductPricingSectionProps) {
  const { t } = useTranslation("");
  const activeForm = (form ?? editForm) as CommonForm;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("product.price.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("product.price.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          <FormField
            control={activeForm.control}
            name="out_price"
            render={({ field }) => {
              return (
                <FormItem className={`col-span-3`}>
                  <FormLabel>{t("product.price.priceLabel")}</FormLabel>
                  <FormControl>
                    <PriceInput
                      disabled={!isEdit}
                      value={field.value}
                      onValueChange={(value, name, values) => {
                        activeForm.setValue("out_price", String(values?.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={activeForm.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("product.price.currencyLabel")}</FormLabel>
                <Select
                  disabled={!isEdit}
                  onValueChange={field.onChange}
                  defaultValue={field.value || "USD"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("product.price.currencyPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="count_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("product.price.countTypeLabel")}</FormLabel>
                <Select
                  disabled={!isEdit}
                  onValueChange={field.onChange}
                  defaultValue={field.value || "PCS"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("product.price.countTypePlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} ({type.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
