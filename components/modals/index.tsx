"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ModalProps {
  trigger?: React.ReactNode;

  title: string;

  description?: string;

  children?: React.ReactNode;

  footer?: React.ReactNode;

  showCloseButton?: boolean;

  open: boolean;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  className?: string;

  header?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  trigger,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  open,
  setOpen,
  className,
  header = true,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(className, "rounded-2xl")}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className={`${!header && "hidden"}`}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && children}

        {footer && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{t("modal.cancel")}</Button>
            </DialogClose>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
