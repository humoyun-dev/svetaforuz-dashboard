import React, { useState, useCallback, useMemo, FormEvent } from "react";
import { UserType } from "@/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PhoneNumber from "@/components/ui/phone-number";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { useTranslation } from "react-i18next";

const AccountSection = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  if (!user) return null;

  const [data, setData] = useState<UserType>(user);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(user);
  }, [data, user]);

  const avatarFallback = useMemo(() => {
    const firstInitial = data.first_name?.charAt(0) || "";
    const lastInitial = data.last_name?.charAt(0) || "";
    return `${firstInitial}${lastInitial}` || "U";
  }, [data.first_name, data.last_name]);

  const handleAvatarChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setData((prev) => ({
        ...prev,
        profile_image: file as any,
      }));
    },
    [],
  );

  function handleChange<K extends keyof UserType>(key: K, value: UserType[K]) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isDirty) return;
      setIsSaving(true);
      try {
        const { status } = await useCrud.update({
          url: "accounts/profile/me/",
          data: data,
          ContentType: "multipart/form-data",
        });
        console.log(status);
      } catch (err) {
        console.log(err);
      } finally {
        setIsSaving(false);
      }
    },
    [data, isDirty],
  );

  return (
    <form onSubmit={handleSubmit} aria-label="Account settings">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 rounded-lg">
            <AvatarImage
              className="object-cover rounded-lg"
              src={
                typeof data.profile_image === "string"
                  ? data.profile_image
                  : data.profile_image
                    ? URL.createObjectURL(data.profile_image)
                    : ""
              }
              alt={
                `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
                t("account.avatar")
              }
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label={t("account.change_avatar")}
          >
            <Camera className="h-4 w-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <Label htmlFor="first_name">{t("account.first_name")}</Label>
          <Input
            id="first_name"
            name="first_name"
            className="mt-2"
            value={data.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="last_name">{t("account.last_name")}</Label>
          <Input
            id="last_name"
            name="last_name"
            className="mt-2"
            value={data.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
        </div>
      </div>

      <div className="grid mt-4">
        <Label htmlFor="email">{t("account.email")}</Label>
        <Input
          id="email"
          name="email"
          className="mt-2"
          value={data.email}
          type="email"
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div className="grid mt-4">
        <Label htmlFor="username">{t("account.username")}</Label>
        <Input
          id="username"
          name="username"
          className="mt-2"
          value={data.username}
          type="text"
          onChange={(e) => handleChange("username", e.target.value)}
        />
      </div>

      <div className="grid mt-4">
        <Label htmlFor="phone_number">{t("account.phone_number")}</Label>
        <PhoneNumber
          className="mt-2"
          id="phone_number"
          value={data.phone_number}
          onChange={(e) =>
            handleChange(
              "phone_number",
              e as unknown as UserType["phone_number"],
            )
          }
        />
      </div>

      <div className="grid mt-4">
        <Label htmlFor="gender">{t("account.gender")}</Label>
        <Select
          name="gender"
          value={data.gender as string}
          onValueChange={(value) =>
            handleChange("gender", value as UserType["gender"])
          }
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder={t("account.select_gender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t("account.gender_male")}</SelectItem>
            <SelectItem value="female">{t("account.gender_female")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex mt-4 items-center justify-end">
        <Button type="submit" disabled={!isDirty || isSaving}>
          {isSaving ? t("account.saving") : t("account.save")}
        </Button>
      </div>
    </form>
  );
};

export default AccountSection;
