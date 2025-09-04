"use client";

import React from "react";
import Modal from "@/components/modals/index";
import { useStoreForm } from "@/hooks/use-store-form";
import StoreForm from "@/components/form/store/form";
import useFetch from "@/hooks/use-fetch";
import type { StoreType } from "@/types/store.type";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const StoreFormModal = () => {
  const { setOpen, open, id, setId } = useStoreForm();
  const { t } = useTranslation("storeFormModal");

  const {
    data: storeData,
    isLoading,
    isError,
    mutate,
  } = useFetch<StoreType>(id ? `store/${id}/` : null);

  const handleSave = React.useCallback(
    async (updatedStore: StoreType) => {
      if (id) {
        await mutate();
      }
      setOpen(false);
    },
    [id, mutate, setOpen],
  );

  const handleCancel = React.useCallback(() => {
    setOpen(false);
    setId("");
  }, [setOpen, setId]);

  const isEdit = Boolean(id);
  const title = isEdit ? t("titles.edit") : t("titles.create");

  return (
    <Modal
      className="md:p-6 overflow-hidden px-1 py-4 w-full max-h-full sm:max-w-[100%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] 3xl:max-w-[25%]"
      open={open}
      setOpen={handleCancel}
      title={title}
    >
      <>
        {isEdit && isLoading && <LoadingSkeleton />}
        {isEdit && isError && (
          <p className="text-red-500 text-center">{t("errors.fetchFailed")}</p>
        )}

        {(!isEdit || (!isLoading && !isError)) && (
          <StoreForm
            id={id}
            initial={isEdit ? (storeData ?? null) : null}
            onSaved={handleSave}
            onCancel={handleCancel}
          />
        )}
      </>
    </Modal>
  );
};

export default StoreFormModal;

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);
