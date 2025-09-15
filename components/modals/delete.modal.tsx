"use client";

import React from "react";
import { useDeleteStore } from "@/hooks/use-delete-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCrud } from "@/hooks/use-crud";
import { notify } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const DeleteModal = () => {
  const { t } = useTranslation();
  const { setOpen, open, url, setUrl, refetch, setRefetch } = useDeleteStore();

  async function handleDelete() {
    try {
      const { status } = await useCrud.delete(url);

      if (status >= 200 && status < 300) {
        setOpen(false);
        setUrl("");
        if (refetch) {
          refetch();
        }
        notify.success(t("deleteModal.success"));
      }
    } catch (error) {
      notify.error(t("deleteModal.error"));
    }
  }

  function handleCancel() {
    setOpen(false);
    setUrl("");
    setRefetch(undefined);
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteModal.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteModal.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("deleteModal.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`bg-destructive/80 text-white hover:bg-destructive`}
            onClick={handleDelete}
          >
            {t("deleteModal.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
