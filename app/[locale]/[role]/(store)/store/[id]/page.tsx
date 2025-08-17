"use client";

import React, { useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  MapPin,
  Phone,
  Calendar,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";

import useFetch from "@/hooks/use-fetch";
import { StoreType } from "@/types/store.type";

import { useTranslation } from "react-i18next";

interface DetailItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

const DetailItem = ({ label, value, icon, trailing }: DetailItemProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm text-foreground">
      {icon}
      <h4 className="font-medium">{label}</h4>
      {trailing && <div className="ml-auto">{trailing}</div>}
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed break-words">
      {value}
    </div>
  </div>
);

const CopyButton = ({ value }: { value?: string | null }) => {
  const { t } = useTranslation("storePage");
  const onCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard?.writeText(value);
    } catch {}
  }, [value]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={onCopy}
      aria-label={t("actions.copy")}
      disabled={!value}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
};

const Placeholder = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

function initialsFrom(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("storePage");

  const { data: store, isLoading } = useFetch<StoreType>(`store/${id}/`);

  const googleMapsUrl = useMemo(() => {
    if (!store) return undefined;
    const { latitude, longitude } = store;
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }, [store]);

  const onShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: store?.name ?? t("store.title"),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard?.writeText(window.location.href);
      }
    } catch {}
  }, [store?.name, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          actions={
            <Button variant="ghost" size="sm" aria-label={t("aria.share")}>
              <Share2 className="h-4 w-4 mr-2" />
              {t("share")}
            </Button>
          }
        />
        <div className="container mx-auto max-w-4xl px-4 pt-6 pb-12 space-y-6">
          <Placeholder className="w-full h-48" />
          <div className="flex items-center gap-4">
            <Placeholder className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Placeholder className="h-6 w-1/3" />
              <Placeholder className="h-4 w-2/3" />
            </div>
          </div>
          <Placeholder className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!store) return null; // or a NotFound component

  return (
    <div className="min-h-screen bg-background">
      <Header
        actions={
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("aria.share")}
            onClick={onShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t("share")}
          </Button>
        }
      />

      <div className="container mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="relative w-full">
          <AspectRatio ratio={16 / 6}>
            <Image
              src={store.banner || "/placeholder.svg"}
              alt={t("alt.banner", { name: store.name })}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </AspectRatio>

          <div className="absolute left-4 bottom-[-2rem]">
            <Avatar className="h-16 w-16 border-2 border-background rounded-xl bg-background shadow-lg">
              <AvatarImage
                src={store.logo || "/placeholder.svg"}
                alt={store.name}
              />
              <AvatarFallback className="text-sm font-semibold rounded-xl">
                {initialsFrom(store.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pt-10 pb-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {store.name}
                  </h1>
                </div>
              </div>
            </div>

            {store.description && (
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {store.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {t("establishedJan2024")}
              </span>
              <span className="text-border">•</span>
              <span>{t("storeNumber", { id: store.id })}</span>
            </div>
          </div>

          <Tabs defaultValue="about" className="space-y-6">
            <TabsList
              className="grid w-full grid-cols-3 bg-muted/50"
              aria-label={t("aria.storeTabs")}
            >
              <TabsTrigger value="about" className="text-sm">
                {t("tabs.about")}
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-sm">
                {t("tabs.contact")}
              </TabsTrigger>
              <TabsTrigger value="gallery" className="text-sm">
                {t("tabs.gallery")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">
                    {t("sections.storeInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {store.description && (
                    <DetailItem
                      label={t("fields.description")}
                      value={store.description}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">
                    {t("sections.getInTouch")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {store.phone_number && (
                      <DetailItem
                        icon={
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        }
                        label={t("fields.phone")}
                        value={
                          <a
                            className="underline-offset-4 hover:underline font-medium"
                            href={`tel:${store.phone_number}`}
                          >
                            {store.phone_number}
                          </a>
                        }
                        trailing={<CopyButton value={store.phone_number} />}
                      />
                    )}

                    {store.address && (
                      <DetailItem
                        icon={
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        }
                        label={t("fields.address")}
                        value={store.address}
                        trailing={<CopyButton value={store.address} />}
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("sections.location")}
                      </span>
                      {googleMapsUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8"
                        >
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("actions.viewOnMaps")}{" "}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                      <AspectRatio ratio={16 / 9}>
                        {store.latitude && store.longitude ? (
                          <iframe
                            title={t("aria.storeLocation")}
                            className="w-full h-full"
                            loading="lazy"
                            src={`https://maps.google.com/maps?q=${store.latitude},${store.longitude}&z=15&output=embed`}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            {t("states.locationUnavailable")}
                          </div>
                        )}
                      </AspectRatio>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">
                      {t("sections.storeLogo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <AspectRatio
                        ratio={1}
                        className="bg-muted rounded-lg overflow-hidden"
                      >
                        <Image
                          src={store.logo || "/placeholder.svg"}
                          alt={t("alt.logo", { name: store.name })}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">
                      {t("sections.storeBanner")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <AspectRatio
                        ratio={21 / 9}
                        className="bg-muted rounded-lg overflow-hidden"
                      >
                        <Image
                          src={store.banner || "/placeholder.svg"}
                          alt={t("alt.banner", { name: store.name })}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
