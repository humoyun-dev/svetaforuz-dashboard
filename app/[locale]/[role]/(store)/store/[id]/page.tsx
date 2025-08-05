"use client";

import { useParams } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetch from "@/hooks/use-fetch";
import { useDeleteStore } from "@/hooks/use-delete-store";
import { formatedDate } from "@/lib/utils";
import {
  Store,
  MapPin,
  Phone,
  Calendar,
  Share2,
  Edit,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";

interface StoreData {
  id: number;
  name: string;
  description: string;
  phone_number: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  logo: string;
  banner: string | null;
  created_at: string;
  owner: number;
}

const Page = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { setOpen, setUrl } = useDeleteStore();
  const { data, isLoading, isError } = useFetch<StoreData>(`store/${id}/`);

  function handleDelete(id: number) {
    setOpen(true);
    setUrl(`store/${id}/`);
  }
  const { role } = useUserStore();

  const handleShare = () => {
    if (navigator.share && data) {
      navigator.share({
        title: data.name,
        text: data.description || `Check out ${data.name}`,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="relative">
            <Skeleton className="h-64 w-full" />
            <div className="absolute bottom-4 left-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 font-medium text-lg mb-2">
              {t("store.error_load")}
            </div>
            <p className="text-gray-500">{t("store.try_again")}</p>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <div className="text-gray-500 text-lg">{t("store.not_found")}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t("store.share")}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                className={`flex items-center justify-center`}
                href={`/${role}/store/${id}/edit`}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t("store.edit")}
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(data.id)}
            >
              {t("store.delete")}
            </Button>
          </div>
        }
      />

      <div className="min-h-screen bg-gray-50">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
          {data.banner ? (
            <Image
              src={data.banner}
              alt="Store banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={data.logo} alt={data.name} />
              <AvatarFallback className="text-2xl bg-white">
                <Store className="h-12 w-12 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
            <p className="text-gray-600 max-w-2xl mb-4">
              {data.description || (
                <span className="italic text-gray-400">
                  {t("store.no_description")}
                </span>
              )}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("store.created")} {formatedDate(data.created_at)}
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">
                {t("store.tabs.details")}
              </TabsTrigger>
              <TabsTrigger value="contact">
                {t("store.tabs.contact")}
              </TabsTrigger>
              <TabsTrigger value="media">{t("store.tabs.media")}</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>{t("store.tabs.details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("store.details.name")}
                      </h4>
                      <p>{data.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("store.details.id")}
                      </h4>
                      <p>#{data.id}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("store.details.description")}
                      </h4>
                      <p>
                        {data.description || (
                          <span className="italic text-gray-400">
                            {t("store.no_description")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("store.details.created_at")}
                      </h4>
                      <p>{formatedDate(data.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>{t("store.tabs.contact")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {t("store.contact.phone")}
                      </h4>
                      <p>
                        {data.phone_number || (
                          <span className="italic text-gray-400">
                            {t("store.contact.no_phone")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("store.contact.address")}
                      </h4>
                      <p>
                        {data.address || (
                          <span className="italic text-gray-400">
                            {t("store.contact.no_address")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-medium">
                        {t("store.contact.coordinates")}
                      </h4>
                      <p>
                        {data.latitude && data.longitude ? (
                          `${data.latitude}, ${data.longitude}`
                        ) : (
                          <span className="italic text-gray-400">
                            {t("store.contact.no_coords")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!data.phone_number && !data.address && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <strong>Eslatma:</strong>{" "}
                        {t("store.contact.incomplete")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      {t("store.media.logo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.logo ? (
                      <div className="relative w-32 h-32 mx-auto space-y-2">
                        <Image
                          src={data.logo}
                          alt={`${data.name} logo`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                        <p className="text-sm text-center text-gray-500">
                          {t("store.media.current_logo")}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Store className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">
                          {t("store.media.no_logo")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      {t("store.media.banner")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.banner ? (
                      <div className="relative w-full h-32 space-y-2">
                        <Image
                          src={data.banner}
                          alt={`${data.name} banner`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                        <p className="text-sm text-center text-gray-500">
                          {t("store.media.current_banner")}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">
                          {t("store.media.no_banner")}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t("store.media.default_background")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Page;
