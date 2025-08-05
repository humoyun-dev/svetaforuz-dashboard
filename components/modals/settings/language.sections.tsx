"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useState, useTransition, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const languages = [
  {
    value: "uz",
    flag: "🇺🇿",
    name: "Uzbek",
    nativeName: "O'zbekcha",
    placeImage: "/images/samarqand.png",
  },
  {
    value: "ru",
    flag: "🇷🇺",
    name: "Russian",
    nativeName: "Русский",
    placeImage: "/images/russia.png",
  },
  // Agar ko'proq til qo'shmoqchi bo'lsangiz, shu yerga qo'shing
  // {
  //   value: "en",
  //   flag: "🇺🇸",
  //   name: "English",
  //   nativeName: "English",
  //   placeImage: "/placeholder.svg?height=200&width=300",
  // },
] as const;

type Language = (typeof languages)[number]["value"];

export const LanguageSection = memo(function LanguageSection() {
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [changingLanguage, setChangingLanguage] = useState<string | null>(null);

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

  const handleLanguageChange = async (locale: Language) => {
    if (locale === currentLocale || isPending) return;

    setChangingLanguage(locale);

    startTransition(async () => {
      try {
        await handleChange(locale);
      } catch (error) {
        console.error("Failed to change language:", error);
      } finally {
        setChangingLanguage(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">
          {t("settings.language.title")}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t("settings.language.description")}
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">
          {t("settings.language.select")}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map((language) => {
            const isSelected = currentLocale === language.value;
            const isChanging = changingLanguage === language.value;

            return (
              <Card
                key={language.value}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 hover:shadow-md h-56 overflow-hidden",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 shadow-md"
                    : "hover:border-muted-foreground/50",
                  isChanging && "opacity-70 pointer-events-none",
                )}
                onClick={() => handleLanguageChange(language.value)}
              >
                <Image
                  src={language.placeImage || "/placeholder.svg"}
                  alt={`${language.name} famous place`}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{language.flag}</span>
                        <span className="font-medium">
                          {t(`languages.${language.value}.name`, language.name)}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs opacity-80">{language.nativeName}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 ring-2 ring-primary ring-offset-2 rounded-lg pointer-events-none" />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default LanguageSection;
