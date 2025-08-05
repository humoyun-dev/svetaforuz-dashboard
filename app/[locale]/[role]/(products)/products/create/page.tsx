"use client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import Header from "@/components/header";
import ProductCreateForm from "@/components/form/products/create/form";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Page = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Header
        actions={
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.refresh()}
              type="reset"
              form="product-form"
              variant="outline"
            >
              {t("product.create.discard")}
            </Button>
            <Button type="submit" form="product-form">
              <Save className="w-4 h-4 mr-2" />
              {t("product.create.save")}
            </Button>
          </div>
        }
      />
      <div>
        <ProductCreateForm />
      </div>
    </>
  );
};

export default Page;
