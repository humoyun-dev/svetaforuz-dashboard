"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const AppearanceSettings = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();

  const themes = [
    {
      id: "light",
      name: t("appearance.light"),
      description: t("appearance.light_desc"),
      icon: Sun,
      preview: "bg-white border-gray-200",
      accent: "bg-blue-500",
    },
    {
      id: "dark",
      name: t("appearance.dark"),
      description: t("appearance.dark_desc"),
      icon: Moon,
      preview: "bg-gray-900 border-gray-800",
      accent: "bg-blue-400",
    },
    {
      id: "system",
      name: t("appearance.system"),
      description: t("appearance.system_desc"),
      icon: Monitor,
      preview: "border-gray-400",
      accent: "bg-purple-500",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">{t("appearance.title")}</Label>
        <p className="text-sm text-muted-foreground">
          {t("appearance.description")}
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">{t("appearance.theme")}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;

            return (
              <Card
                key={item.id}
                className={cn(
                  "relative cursor-pointer transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 shadow-md"
                    : "hover:border-muted-foreground/50",
                )}
                onClick={() => setTheme(item.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="h-16 rounded-lg border-2 relative overflow-hidden">
                    {item.id === "system" ? (
                      <div className="w-full h-full flex">
                        <div className="w-1/2 bg-white border-r border-gray-300" />
                        <div className="w-1/2 bg-gray-900" />
                      </div>
                    ) : (
                      <div className={cn("w-full h-full", item.preview)} />
                    )}
                    <div
                      className={cn(
                        "absolute top-2 left-2 w-3 h-3 rounded-full",
                        item.accent,
                      )}
                    />
                    <div
                      className={cn(
                        "absolute bottom-2 left-2 right-2 h-1 rounded",
                        item.id === "dark" ? "bg-white/20" : "bg-black/20",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute bottom-2 left-2 w-1/3 h-1 rounded",
                        item.id === "dark" ? "bg-white/40" : "bg-black/40",
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-medium">
          {t("appearance.display_options")}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleCard
            title={t("appearance.reduce_motion")}
            description={t("appearance.reduce_motion_desc")}
          />
          <ToggleCard
            title={t("appearance.high_contrast")}
            description={t("appearance.high_contrast_desc")}
          />
        </div>
      </div>
    </div>
  );
};

const ToggleCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <div className="w-10 h-6 bg-muted rounded-full relative">
          <div className="w-4 h-4 bg-background rounded-full absolute top-1 left-1 transition-transform" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AppearanceSettings;
