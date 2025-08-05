"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";
import Header from "@/components/header";
import ProductCreateForm from "@/components/form/products/create/form";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/stores/store.store";
import useFetch from "@/hooks/use-fetch";
import { ProductFormData } from "@/lib/validation";
import { useTranslation } from "react-i18next";

const Page = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { selectedShop } = useStore();
  const [isEdit, setIsEdit] = useState(false);

  const productsUrl = useMemo(() => {
    if (!selectedShop?.id) return;

    return `${selectedShop.id}/products/products/${id}/`;
  }, [selectedShop?.id, id]);

  const {
    safeData: data,
    isLoading,
    refetch,
  } = useFetch<ProductFormData>(productsUrl);

  return (
    <>
      <Header
        actions={
          <div className="flex items-center space-x-3">
            {isEdit ? (
              <>
                <Button
                  onClick={() => router.refresh()}
                  type={"reset"}
                  form="product-form"
                  variant="outline"
                  size={`sm`}
                >
                  {t("product.create.discard")}
                </Button>
                <Button type="submit" size={`sm`} form="product-form">
                  <Save className="w-4 h-4 mr-2" />
                  {t("product.create.save")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEdit(true)}
                type="button"
                size={`sm`}
                form="product-form"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t("product.create.edit")}
              </Button>
            )}
          </div>
        }
      />
      <div>
        <ProductCreateForm
          productId={id}
          initialData={data}
          isEdit={isEdit}
          refetch={refetch}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Page;
