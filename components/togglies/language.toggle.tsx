"use client";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LanguageToggle = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const { t } = useTranslation();

  const handleChange = useCallback(
    async (newLocale: string) => {
      document.cookie = `NEXT_LOCALE=${newLocale};expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()};path=/`;

      const newPathname = currentPathname.replace(
        `/${currentLocale}`,
        `/${newLocale}`,
      );

      await i18n.changeLanguage(newLocale);
      router.replace(newPathname);
      router.refresh();
    },
    [currentLocale, currentPathname, router, i18n],
  );

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={handleChange}
      value={currentLocale}
    >
      <SelectTrigger className={cn("p-0 px-3 text-sm", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ru">Русский</SelectItem>
        <SelectItem value="uz">O'zbekcha</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageToggle;
