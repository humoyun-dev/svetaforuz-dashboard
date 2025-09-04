"use client";
import React from "react";
import { TransactionMethod } from "@/types/transaction.type";
import { BanknoteArrowDown, BanknoteArrowUp, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Option {
  label: string;
  value: TransactionMethod;
  icon: LucideIcon;
}

interface Props {
  value: TransactionMethod;
  setValue: (value: TransactionMethod) => void;
}

const MethodForm = ({ value, setValue }: Props) => {
  const { t } = useTranslation();

  const options: Option[] = [
    { label: t("method.transfer"), value: "transfer", icon: BanknoteArrowUp },
    { label: t("method.accept"), value: "accept", icon: BanknoteArrowDown },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => setValue(opt.value)}
            className={`${isActive && "bg-primary text-primary-foreground shadow-sm"} 
              p-4 rounded-lg border cursor-pointer text-center flex items-center gap-2 justify-center`}
          >
            <opt.icon />
            <p>{opt.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MethodForm;
