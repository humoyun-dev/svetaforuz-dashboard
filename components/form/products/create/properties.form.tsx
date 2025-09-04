"use client";

import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, X, AlertCircle, Edit2, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  CommonForm,
  ProductEditData,
  ProductFormData,
} from "@/lib/validation";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useStore } from "@/stores/store.store";
import { PropertiesType } from "@/types/products.type";
import { useCrud } from "@/hooks/use-crud";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/toast";
import { useTranslation } from "react-i18next";

interface ProductAttributesSectionProps {
  form?: UseFormReturn<ProductFormData>;
  productId?: string;
  editForm?: UseFormReturn<ProductEditData>;
  isEdit?: boolean;
}

export default function ProductAttributesSection({
  form,
  editForm,
  productId,
  isEdit,
}: ProductAttributesSectionProps) {
  const { t } = useTranslation();
  const activeForm = (form ?? editForm) as CommonForm;

  const {
    fields: propertyFields,
    append: appendProperty,
    remove: removeProperty,
  } = useFieldArray({
    control: activeForm.control,
    name: "properties",
  });

  const handleAddProperty = () => appendProperty({ feature: "", value: "" });
  const handleRemoveProperty = (index: number) =>
    propertyFields.length > 1 && removeProperty(index);

  const properties = activeForm.watch("properties");
  const hasDuplicates =
    Number(properties?.length) > 0 &&
    (() => {
      const features = properties
        ?.map((p) => p.feature.toLowerCase().trim())
        .filter((f) => f !== "");
      return new Set(features).size !== features?.length;
    })();

  useEffect(() => {
    if (hasDuplicates) {
      activeForm.setError("properties", {
        type: "manual",
        message: t("product.errors.duplicate_features"),
      });
    }
  }, [hasDuplicates, activeForm, t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("product.attributes.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("product.attributes.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasDuplicates && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("product.errors.duplicate_features")}
            </AlertDescription>
          </Alert>
        )}

        {productId ? (
          <APIComponent isEdit={isEdit} productID={productId} />
        ) : (
          <div className="space-y-4">
            {propertyFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    {t("product.attributes.attribute")} {index + 1}
                  </h3>
                  {propertyFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProperty(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={activeForm.control}
                    name={`properties.${index}.feature`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("product.attributes.name")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "product.attributes.name_placeholder",
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={activeForm.control}
                    name={`properties.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("product.attributes.value")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "product.attributes.value_placeholder",
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddProperty}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("product.attributes.add")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type MockProperty = {
  feature: string;
  value: string;
  product: number;
};

const APIComponent = ({
  productID,
  isEdit,
}: {
  productID: string;
  isEdit?: boolean;
}) => {
  const { selectedShop } = useStore();
  const { create, delete: remove } = useCrud;
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState<MockProperty[]>([]);

  const {
    safeData: properties = [],
    isLoading,
    refetch,
  } = useFetch<PropertiesType[]>(
    selectedShop?.id
      ? `${selectedShop.id}/products/products/${productID}/properties/`
      : null,
    {},
  );

  const handleAddRow = () => {
    setMockData([
      ...mockData,
      { feature: "", value: "", product: Number(productID) },
    ]);
  };

  const handleCreate = async (index: number) => {
    const data = mockData[index];
    if (!data.feature || !data.value) return;

    setLoading(true);
    try {
      const { status } = await create({
        url: `${selectedShop?.id}/products/products/${productID}/properties-add/`,
        data: data,
      });
      if (status == 201) {
        notify.success(t("product.notifications.property_added"));
        refetch();
        const updated = [...mockData];
        updated.splice(index, 1);
        setMockData(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  const handleMockChange = (
    index: number,
    field: "feature" | "value",
    value: string,
  ) => {
    const updated = [...mockData];
    updated[index][field] = value;
    setMockData(updated);
  };

  const handleMockDelete = (index: number) => {
    const updated = [...mockData];
    updated.splice(index, 1);
    setMockData(updated);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((item) => (
        <PropertyCard
          isEdit={isEdit}
          key={item.id}
          {...item}
          productID={productID}
          refetch={refetch}
        />
      ))}

      {mockData.map((item, index) => (
        <div
          key={`mock-${index}`}
          className="grid grid-cols-5 items-center gap-4 rounded-lg border p-4 shadow-sm bg-white"
        >
          <div className="col-span-2">
            <Label className="mb-2">{t("product.attributes.name")}</Label>
            <Input
              value={item.feature}
              onChange={(e) =>
                handleMockChange(index, "feature", e.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="col-span-2 text-right">
            <Label className="mb-2">{t("product.attributes.value")}</Label>
            <Input
              value={item.value}
              onChange={(e) => handleMockChange(index, "value", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-end gap-1">
            <Button
              onClick={() => handleCreate(index)}
              type="button"
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              {t("product.attributes.submit")}
            </Button>
            <Button
              onClick={() => handleMockDelete(index)}
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddRow}
        type="button"
        disabled={!isEdit}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("product.attributes.add")}
      </Button>
    </div>
  );
};

const PropertyCard = ({
  id,
  feature,
  value,
  productID,
  refetch,
  isEdit = false,
}: {
  id: number;
  feature: string;
  value: string;
  productID: string;
  refetch: () => void;
  isEdit?: boolean;
}) => {
  const { update, delete: remove } = useCrud;
  const { selectedShop } = useStore();
  const [data, setData] = useState<PropertiesType>({
    id,
    feature,
    value,
    product: Number(productID),
  });
  const { t } = useTranslation();

  const handleUpdate = async () => {
    try {
      const { status } = await update({
        url: `${selectedShop?.id}/products/properties/${id}/`,
        data,
      });

      if (status === 200) {
        notify.success(t("product.notifications.property_updated"));
        refetch();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      const { status } = await remove(
        `${selectedShop?.id}/products/properties/${id}/`,
      );

      if (status === 204) {
        notify.success(t("product.notifications.property_deleted"));
        refetch();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-5 items-center gap-4 rounded-lg border p-4 shadow-sm bg-white">
      <div className="col-span-2">
        <Label className={`mb-2`}>{t("product.attributes.name")}</Label>
        <Input
          value={data.feature}
          onChange={(e) => setData({ ...data, feature: e.target.value })}
          disabled={!isEdit}
        />
      </div>

      <div className="col-span-2 text-right">
        <Label className={`mb-2`}>{t("product.attributes.value")}</Label>
        <Input
          value={data.value}
          onChange={(e) => setData({ ...data, value: e.target.value })}
          disabled={!isEdit}
        />
      </div>

      <div className="flex items-center justify-end gap-1">
        {isEdit && (
          <>
            <Button
              onClick={handleUpdate}
              type="button"
              size="sm"
              variant="secondary"
            >
              {t("product.attributes.submit")}
            </Button>
            <Button
              onClick={handleDelete}
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
