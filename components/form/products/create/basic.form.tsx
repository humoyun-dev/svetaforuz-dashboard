"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type {
  ProductFormData,
  ProductEditData,
  CommonForm,
} from "@/lib/validation";
import { useTranslation } from "react-i18next";

interface ProductBasicInformationSectionProps {
  form?: UseFormReturn<ProductFormData>;
  editForm?: UseFormReturn<ProductEditData>;
  isEdit?: boolean;
}

export default function ProductBasicInformationSection({
  form,
  editForm,
  isEdit,
}: ProductBasicInformationSectionProps) {
  const activeForm = (form ?? editForm) as CommonForm;

  const { t } = useTranslation();

  if (!activeForm) {
    throw new Error(
      "ProductBasicInformationSection requires either `form` or `editForm`.",
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("product.basic.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("product.basic.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={activeForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("product.basic.form.name.label")}</FormLabel>
              <FormControl>
                <Input
                  disabled={!isEdit}
                  placeholder={t("product.basic.form.name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={activeForm.control}
          name="description"
          disabled={!isEdit}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("product.basic.form.description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[100px]"
                  placeholder={t("product.basic.form.description.placeholder")}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                {t("product.basic.form.description.hint")}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
