"use client";

import React, { useState } from "react";
import Modal from "@/components/modals/index";
import { Label } from "@/components/ui/label";
import { CategoryFormType } from "@/types/products.type";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { useCategory } from "@/hooks/use-category";
import { Input } from "@/components/ui/input";

const CategoryCreateModal = () => {
  const { t } = useTranslation();
  const { setOpen, open } = useCategory();

  const [data, setData] = useState<CategoryFormType>({
    name: "",
  });

  async function submitForm() {
    try {
      const { status } = await useCrud.create({
        url: `categories/`,
        data: data,
      });

      if (status === 201) {
        notify.success(t("category.toast.success"));
        setOpen(false);
        setData({
          name: "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleCancel() {
    setOpen(false);
    setData({
      name: "",
    });
  }

  return (
    <Modal
      className="md:p-6 overflow-hidden px-1 py-4 w-full max-h-full sm:max-w-[100%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] 3xl:max-w-[25%]"
      open={open}
      title={t("category.modal.title")}
      setOpen={handleCancel}
      footer={
        <Button onClick={submitForm}>{t("category.modal.create")}</Button>
      }
    >
      <>
        <div className="">
          <Label htmlFor={`name`} className="text-sm font-medium">
            {t("category.form.name")}
          </Label>
          <Input
            name={"name"}
            value={data.name}
            className={`mt-2`}
            onChange={(e) =>
              setData({ ...data, [e.target.name]: e.target.value })
            }
            placeholder={t("category.form.placeholder")}
          />
        </div>
      </>
    </Modal>
  );
};

export default CategoryCreateModal;
