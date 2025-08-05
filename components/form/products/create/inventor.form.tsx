"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import type {
  CommonForm,
  ProductEditData,
  ProductFormData,
} from "@/lib/validation";
import { useTranslation } from "react-i18next";

interface ProductVisibilitySectionProps {
  form?: UseFormReturn<ProductFormData>;
  editForm?: UseFormReturn<ProductEditData>;
}

export default function ProductVisibilitySection({
  form,
  editForm,
}: ProductVisibilitySectionProps) {
  const activeForm = (form ?? editForm) as CommonForm;
  const isVisible = activeForm.watch("in_stock");

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("product.visibility.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("product.visibility.subtitle")}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <FormField
          control={activeForm.control}
          name="in_stock"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t("product.visibility.label")}
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t("product.visibility.description")}
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Alert>
          {isVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          <AlertDescription>
            <strong>
              {isVisible
                ? t("product.visibility.visible.status")
                : t("product.visibility.hidden.status")}
            </strong>
            <br />
            {isVisible
              ? t("product.visibility.visible.description")
              : t("product.visibility.hidden.description")}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
