"use client";

import type React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useId,
} from "react";
import { Crosshair } from "lucide-react";
import type { StoreForm as StoreFormType, StoreType } from "@/types/store.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageInput } from "@/components/ui/image.input";
import { useCrud } from "@/hooks/use-crud";
import { useStore } from "@/stores/store.store";
import { notify } from "@/lib/toast";
import PhoneNumber from "@/components/ui/phone-number";
import { useTranslation } from "react-i18next";

type Props = {
  id?: string;
  initial?: StoreType | null;
  onSaved?: (updated: StoreType) => void;
  onCancel?: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
function parseCoord(s: string, min: number, max: number): number | null {
  const n = Number(s);
  return Number.isNaN(n) ? null : clamp(n, min, max);
}

export default function StoreForm({ id, initial, onSaved, onCancel }: Props) {
  const { t } = useTranslation("storeForm");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const abortRef = useRef<AbortController>();

  const { updateShop, setShops, shops } = useStore();

  const [form, setForm] = useState<StoreFormType>(() => ({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    address: initial?.address ?? "",
    phone_number: initial?.phone_number ?? "",
    latitude: initial?.latitude ?? "",
    longitude: initial?.longitude ?? "",
    logo: initial?.logo ?? "",
    banner: initial?.banner ?? "",
  }));

  const [files, setFiles] = useState<{
    logo: File | null;
    banner: File | null;
  }>({ logo: null, banner: null });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? "",
        description: initial.description ?? "",
        address: initial.address ?? "",
        phone_number: initial.phone_number ?? "",
        latitude: initial.latitude ?? "",
        longitude: initial.longitude ?? "",
        logo: initial.logo ?? "",
        banner: initial.banner ?? "",
      });
    }
  }, [initial]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleFileChange = useCallback(
    (name: "logo" | "banner", file: File | null) => {
      setFiles((prev) => ({ ...prev, [name]: file }));
    },
    [],
  );

  const setLatLng = useCallback((lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  }, []);

  const onBlurCoord = useCallback(
    (e: React.FocusEvent<HTMLInputElement>, min: number, max: number) => {
      const val = parseCoord(e.target.value, min, max);
      if (val !== null) {
        setForm((prev) => ({ ...prev, [e.target.name]: val.toFixed(6) }));
      }
    },
    [],
  );

  const latNum = useMemo(
    () => parseCoord(form.latitude || "", -90, 90),
    [form.latitude],
  );
  const lngNum = useMemo(
    () => parseCoord(form.longitude || "", -180, 180),
    [form.longitude],
  );
  const hasInvalidCoords =
    (form.latitude !== "" && latNum === null) ||
    (form.longitude !== "" && lngNum === null);

  const useMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      notify.error(t("errors.geolocationUnavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng(pos.coords.latitude, pos.coords.longitude),
      () => notify.error(t("errors.geolocationFailed")),
    );
  }, [setLatLng, t]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (hasInvalidCoords) {
        notify.error(t("errors.invalidCoords"));
        return;
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setSaving(true);

      try {
        const fd = new FormData();

        const SKIP_KEYS = new Set(["logo", "banner"]);
        for (const [key, value] of Object.entries(form)) {
          if (SKIP_KEYS.has(key)) continue;
          if (typeof value === "string" && value.trim() !== "") {
            fd.append(key, value.trim());
          }
        }

        if (files.logo instanceof File) {
          fd.append("logo", files.logo, files.logo.name);
        }
        if (files.banner instanceof File) {
          fd.append("banner", files.banner, files.banner.name);
        }

        const isEdit = Boolean(id);
        const endpoint = isEdit ? `store/${id}/` : `store/`;

        const reqPromise = isEdit
          ? useCrud.update<StoreType>({
              url: endpoint,
              data: fd,
              signal: abortRef.current.signal,
            })
          : useCrud.create<StoreType>({
              url: endpoint,
              data: fd,
              signal: abortRef.current.signal,
            });

        const { status, data } = await notify.promise(
          reqPromise,
          {
            loading: isEdit ? t("toasts.updating") : t("toasts.creating"),
            success: (res: any) =>
              isEdit ? t("toasts.updated") : t("toasts.created"),
            error: (err: any) => err?.message || t("toasts.requestFailedRetry"),
          },
          { duration: 2200 },
        );

        if (status >= 200 && status < 300) {
          startTransition(() => {
            setFiles({ logo: null, banner: null });
            onSaved?.(data);
          });

          if (isEdit) {
            updateShop(data);
          } else {
            const exists = shops.some((s) => s.id === data.id);
            setShops(
              exists
                ? shops.map((s) => (s.id === data.id ? data : s))
                : [...shops, data],
            );
          }
        } else {
          notify.error(t("errors.requestFailed"));
        }
      } catch (err: any) {
        console.error(err);
        if (err?.name !== "AbortError") {
          notify.error(err?.message || t("errors.unknown"));
        }
      } finally {
        setSaving(false);
      }
    },
    [
      form,
      files,
      id,
      hasInvalidCoords,
      onSaved,
      updateShop,
      setShops,
      shops,
      t,
    ],
  );

  const uid = useId();

  const submitText = saving
    ? id
      ? t("actions.updating")
      : t("actions.saving")
    : id
      ? t("actions.update")
      : t("actions.save");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("fields.name")}
            <span className="text-red-500"> *</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder={t("placeholders.name")}
            autoComplete="organization"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">{t("fields.phone")}</Label>
          <PhoneNumber
            id="phone_number"
            value={form.phone_number || ""}
            onChange={(phone) =>
              setForm((prev) => ({ ...prev, phone_number: phone }))
            }
            placeholder={t("placeholders.phone")}
            disabled={saving}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">{t("fields.address")}</Label>
          <Input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder={t("placeholders.address")}
            autoComplete="street-address"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude">{t("fields.latitude")}</Label>
          <Input
            id="latitude"
            name="latitude"
            inputMode="decimal"
            value={form.latitude || ""}
            onChange={handleChange}
            onBlur={(e) => onBlurCoord(e, -90, 90)}
            aria-invalid={form.latitude !== "" && latNum === null}
            aria-describedby={`latitude-error-${uid}`}
            disabled={saving}
          />
          {form.latitude !== "" && latNum === null && (
            <p id={`latitude-error-${uid}`} className="text-xs text-red-600">
              {t("errors.latitudeFormat")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">{t("fields.longitude")}</Label>
          <Input
            id="longitude"
            name="longitude"
            inputMode="decimal"
            value={form.longitude || ""}
            onChange={handleChange}
            onBlur={(e) => onBlurCoord(e, -180, 180)}
            aria-invalid={form.longitude !== "" && lngNum === null}
            aria-describedby={`longitude-error-${uid}`}
            disabled={saving}
          />
          {form.longitude !== "" && lngNum === null && (
            <p id={`longitude-error-${uid}`} className="text-xs text-red-600">
              {t("errors.longitudeFormat")}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <Button
            type="button"
            variant="outline"
            onClick={useMyLocation}
            className="gap-2"
            disabled={saving}
          >
            <Crosshair className="size-4" /> {t("actions.useMyLocation")}
          </Button>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t("labels.location")}</Label>
          <p className="text-xs text-muted-foreground">{t("help.location")}</p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">{t("fields.description")}</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder={t("placeholders.description")}
            disabled={saving}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ImageInput
          label={t("labels.logo")}
          name="logo"
          currentUrl={form.logo}
          file={files.logo}
          setFile={(file) => handleFileChange("logo", file)}
          disabled={saving}
        />
        <ImageInput
          label={t("labels.banner")}
          name="banner"
          currentUrl={form.banner}
          file={files.banner}
          setFile={(file) => handleFileChange("banner", file)}
          disabled={saving}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving || isPending || hasInvalidCoords}
        >
          {submitText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving || isPending}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </form>
  );
}
