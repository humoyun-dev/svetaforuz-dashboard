"use client";

import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ImageIcon, Upload, X, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { notify } from "@/lib/toast";
import {
  CommonForm,
  type ProductEditData,
  ProductFormData,
} from "@/lib/validation";
import { useStore } from "@/stores/store.store";
import { ProductImageType } from "@/types/products.type";
import useFetch from "@/hooks/use-fetch";
import { useCrud } from "@/hooks/use-crud";
import Image from "@/components/ui/image";
import { useTranslation } from "react-i18next";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
}

interface ProductMediaSectionProps {
  form?: UseFormReturn<ProductFormData>;
  productId?: string;
  isEdit?: boolean;
  editForm?: UseFormReturn<ProductEditData>;
}

const ProductImageCard = memo(
  ({
    src,
    index,
    isPrimary,
    onDelete,
    onSetPrimary,
  }: {
    src: string;
    index: number;
    isPrimary: boolean;
    onDelete: () => void;
    onSetPrimary?: () => void;
  }) => {
    const { t } = useTranslation();
    return (
      <div className="relative group rounded-lg border overflow-hidden">
        <Image
          src={src}
          alt={`image-${index}`}
          className="w-full h-32 object-cover"
        />
        {isPrimary && (
          <Badge className="absolute top-2 left-2 text-xs bg-primary">
            {t("product.media.badge")}
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
          {index + 1}
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          {onSetPrimary && (
            <Button size="sm" variant="secondary" onClick={onSetPrimary}>
              {t("product.media.setPrimary")}{" "}
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  },
);

export default function ProductMediaSection({
  form,
  editForm,
  productId,
  isEdit,
}: ProductMediaSectionProps) {
  const { selectedShop } = useStore();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const filesRef = useRef<MediaFile[]>([]);
  filesRef.current = files;
  const { t } = useTranslation();

  const activeForm = (form ?? editForm) as CommonForm;

  const { create, delete: deleteImage } = useCrud;

  const { safeData: prImages = [], refetch } = useFetch<ProductImageType[]>(
    productId
      ? `${selectedShop?.id}/products/products/${productId}/images/`
      : null,
  );

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  useEffect(() => {
    activeForm.setValue(
      "images",
      files.map((f) => ({ image: f.file })),
      { shouldValidate: true },
    );
  }, [files, form]);

  const validateFiles = useCallback((fileList: File[]) => {
    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 5MB`);
        continue;
      }
      valid.push(file);
    }

    if (errors.length) {
      notify.warning("Some files skipped", {
        description: errors.join(", "),
        duration: 5000,
      });
    }
    return valid;
  }, []);

  const addFiles = useCallback(
    async (fileList: File[]) => {
      const newFiles: MediaFile[] = fileList.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        if (!primaryImageId && updated.length) {
          setPrimaryImageId(updated[0].id);
        }
        return updated;
      });

      notify.success(`${fileList.length} image(s) prepared`, {
        duration: 2000,
      });

      if (productId && selectedShop?.id) {
        setIsUploading(true);
        try {
          const uploadPromises = fileList.map((file) => {
            const formData = new FormData();
            formData.append("image", file);
            return create({
              url: `${selectedShop.id}/products/products/${productId}/images-add/`,
              data: formData,
              ContentType: "multipart/form-data",
            });
          });

          setFiles([]);

          await Promise.all(uploadPromises);
          notify.success("All images uploaded", { duration: 2000 });
        } catch (error) {
          console.error(error);
          notify.error("Error uploading images");
        } finally {
          await refetch();
          setIsUploading(false);
        }
      }
    },
    [productId, selectedShop?.id, create, refetch, primaryImageId],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (isUploading) return;
      const valid = validateFiles(Array.from(e.dataTransfer.files));
      if (valid.length) addFiles(valid);
    },
    [isUploading, validateFiles, addFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;
      const valid = validateFiles(Array.from(e.target.files || []));
      if (valid.length) addFiles(valid);
      e.target.value = "";
    },
    [isUploading, validateFiles, addFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === id);
        if (file) URL.revokeObjectURL(file.preview);
        const updated = prev.filter((f) => f.id !== id);
        if (primaryImageId === id) setPrimaryImageId(updated[0]?.id ?? null);
        return updated;
      });
      notify.info("Image removed", { duration: 2000 });
    },
    [primaryImageId],
  );

  const handleSetAsPrimary = useCallback((id: string) => {
    setPrimaryImageId(id);
    setFiles((prev) => {
      const main = prev.find((f) => f.id === id);
      const rest = prev.filter((f) => f.id !== id);
      return main ? [main, ...rest] : prev;
    });
    notify.info("Primary image set", { duration: 2000 });
  }, []);

  const handleRemoveAPI = useCallback(
    async (imageId: number) => {
      try {
        const { status } = await deleteImage(
          `${selectedShop?.id}/products/images/${imageId}/`,
        );
        if (status === 204) {
          notify.info("Remote image deleted", { duration: 2000 });
          refetch();
        }
      } catch (err) {
        console.error(err);
        notify.error("Failed to delete image");
      }
    },
    [deleteImage, refetch, selectedShop?.id],
  );

  // Derived values
  const totalImages = useMemo(
    () => files.length + prImages.length,
    [files.length, prImages.length],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("product.media.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("product.media.subtitle")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={activeForm.control}
          name="images"
          disabled={!isEdit}
          render={() => (
            <FormItem>
              <FormLabel className="sr-only">Images</FormLabel>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
              >
                <Upload className="mx-auto w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {t("product.media.dropzone.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("product.media.dropzone.subtitle")}
                </p>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={isUploading}
                  >
                    <label>
                      {isUploading
                        ? t("product.media.dropzone.button.uploading")
                        : t("product.media.dropzone.button.default")}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInput}
                        disabled={isUploading || !isEdit}
                      />
                    </label>
                  </Button>
                </div>
                {isUploading && (
                  <div className="mt-4 flex justify-center items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>{t("product.media.dropzone.uploading")}</span>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {(files.length > 0 || prImages.length > 0) && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {t("product.media.uploaded", { count: totalImages })}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {prImages.map((img, i) => (
                <ProductImageCard
                  key={`remote-${img.id}`}
                  src={img.image}
                  index={i}
                  isPrimary={i === 0}
                  onDelete={() => handleRemoveAPI(img.id)}
                />
              ))}

              {files.map((f, i) => (
                <ProductImageCard
                  key={f.id}
                  src={f.preview}
                  index={i + prImages.length}
                  isPrimary={primaryImageId === f.id}
                  onDelete={() => handleRemove(f.id)}
                  onSetPrimary={
                    i !== 0 ? () => handleSetAsPrimary(f.id) : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
