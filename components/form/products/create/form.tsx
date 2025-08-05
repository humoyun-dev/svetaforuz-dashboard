"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/toast";
import {
  productFormSchema,
  type ProductFormData,
  productEditSchema,
  ProductEditData,
} from "@/lib/validation";
import ProductBasicInformationSection from "@/components/form/products/create/basic.form";
import ProductMediaSection from "@/components/form/products/create/media.form";
import ProductPricingSection from "@/components/form/products/create/price.form";
import ProductAttributesSection from "@/components/form/products/create/properties.form";
import ProductStockSection from "@/components/form/products/create/stock.form";
import ProductInventorySection from "@/components/form/products/create/inventor.form";
import { useStore } from "@/stores/store.store";
import { useCrud } from "@/hooks/use-crud";
import { createProductFormData } from "@/lib/formData";
import { normalizeNumber } from "@/lib/utils";
import { Loading } from "@/components/loading/loading";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import BarcodeR from "@/components/barcode";
import useFetch from "@/hooks/use-fetch";
import { DetailProductType, ProductImageType } from "@/types/products.type";

interface ProductCreateFormProps {
  onSubmit?: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<ProductFormData>;
  productId?: string;
  refetch?: () => void;
  isEdit?: boolean;
}

export default function ProductCreateForm({
  onSubmit,
  isLoading = false,
  initialData,
  productId,
  refetch,
  isEdit,
}: ProductCreateFormProps) {
  if (productId && initialData) {
    return (
      <UpdateProductFormData
        refetch={refetch}
        productId={productId}
        initialData={initialData}
        isEdit={isEdit}
      />
    );
  } else {
    return <CreateProductForm />;
  }
}

const UpdateProductFormData = ({
  initialData,
  productId,
  refetch,
  isEdit = false,
}: ProductCreateFormProps) => {
  const router = useRouter();

  const { t } = useTranslation();

  const { selectedShop } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductEditData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: initialData?.name || "",
      out_price: initialData?.out_price || "",
      in_stock: initialData?.in_stock ?? true,
      description: initialData?.description || "",
      count_type: initialData?.count_type || "PCS",
      currency: initialData?.currency || "USD",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { data } = useFetch<DetailProductType>(
    productId ? `${selectedShop?.id}/products/products/${productId}/` : null,
  );

  const handleFormSubmit = async (data: ProductEditData) => {
    const parsedOutPrice = normalizeNumber(data.out_price);

    const payload = {
      ...data,
      out_price: parsedOutPrice,
    };

    setIsSubmitting(true);

    try {
      await notify.promise(
        useCrud.update({
          url: `${selectedShop?.id}/products/products/${productId}/`,
          data: payload,
        }),
        {
          loading: t("product.form.saving"),
          success: t("product.form.success_update", { name: data.name }),
          error: t("product.form.error_create"),
        },
      );

      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Form {...form}>
        <form
          name={"product-form"}
          id="product-form"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProductBasicInformationSection isEdit={isEdit} editForm={form} />
              <ProductMediaSection
                isEdit={isEdit}
                productId={productId}
                editForm={form}
              />
              <ProductPricingSection isEdit={isEdit} editForm={form} />
              <ProductAttributesSection
                isEdit={isEdit}
                productId={productId}
                editForm={form}
              />
              <ProductStockSection
                isEdit={isEdit}
                productId={productId}
                editForm={form}
              />
            </div>

            <div className="space-y-8">
              <ProductInventorySection editForm={form} />

              {data?.barcode && (
                <Card>
                  <CardHeader>
                    <CardTitle>Barcode</CardTitle>
                  </CardHeader>
                  <CardContent className={`flex items-center justify-center`}>
                    <BarcodeR value={data.barcode} />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t("product.form.status")}
                    </Label>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {t("product.status.active")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t("product.form.visibility")}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {t("product.form.online_store")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

const CreateProductForm = ({
  initialData,
  isEdit = true,
}: ProductCreateFormProps) => {
  const { selectedShop } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      out_price: initialData?.out_price || "",
      in_stock: initialData?.in_stock ?? true,
      description: initialData?.description || "",
      count_type: initialData?.count_type || "PCS",
      currency: initialData?.currency || "USD",
      properties: initialData?.properties || [{ feature: "", value: "" }],
      images: initialData?.images || [],
      stock: initialData?.stock || [
        {
          quantity: "",
          unit_price: "",
          currency: "USD",
          is_warehouse: false,
        },
      ],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFormSubmit = async (data: ProductFormData) => {
    const features = data.properties
      ?.map((p) => p.feature.toLowerCase().trim())
      .filter((f) => f !== "");

    const parsedOutPrice = normalizeNumber(data.out_price);
    const parsedStock = data.stock.map((item) => ({
      ...item,
      quantity: normalizeNumber(item.quantity),
      unit_price: normalizeNumber(item.unit_price),
    }));

    const payload = {
      ...data,
      out_price: parsedOutPrice,
      stock: parsedStock,
    };

    const uniqueFeatures = new Set(features);
    if (uniqueFeatures.size !== features?.length) {
      notify.error("Validation Error", {
        description: t("product.form.error_validation"),
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await notify.promise(
        useCrud.create({
          url: `${selectedShop?.id}/products/products/`,
          data: createProductFormData(payload),
        }),
        {
          loading: t("product.form.saving"),
          success: t("product.form.success_create", { name: data.name }),
          error: t("product.form.error_create"),
        },
        {
          description: t("product.form.description_images_uploaded", {
            count: data.images?.length,
          }),
          duration: 4000,
        },
      );

      form.reset();
    } catch (error) {
      console.error(t("product.form.error_create"), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Form {...form}>
        <form
          name={"product-form"}
          id="product-form"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProductBasicInformationSection form={form} isEdit={isEdit} />
              <ProductMediaSection form={form} isEdit={isEdit} />
              <ProductPricingSection form={form} isEdit={isEdit} />
              <ProductAttributesSection form={form} isEdit={isEdit} />
              <ProductStockSection form={form} isEdit={isEdit} />
            </div>

            <div className="space-y-8">
              <ProductInventorySection form={form} />

              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t("product.form.status")}
                    </Label>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {t("product.status.active")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t("product.form.visibility")}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {t("product.form.online_store")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t("product.form.images")}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {t("product.form.images_uploaded", {
                        count: form.watch("images")?.length || 0,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
