"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useId,
} from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageIcon, Upload, X } from "lucide-react";

type Props = {
  label: string;
  name: "logo" | "banner";
  currentUrl?: string;
  file: File | null;
  setFile: (f: File | null) => void;
  disabled?: boolean;
};

function ImageInputImpl({
  label,
  name,
  currentUrl,
  file,
  setFile,
  disabled,
}: Props) {
  "use memo";

  const [localPreview, setLocalPreview] = useState<string | undefined>(
    undefined,
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uid = useId();
  const inputId = `${name}-input-${uid}`;
  const emptyInputId = `${name}-input-empty-${uid}`;

  useEffect(() => {
    if (!file) {
      setLocalPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const preview = useMemo(
    () => localPreview ?? currentUrl,
    [localPreview, currentUrl],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith("image/")) {
        setFile(f);
      }
    },
    [setFile],
  );

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      setFile(f);
    },
    [setFile],
  );

  const onReplaceClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onClear = useCallback(() => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [setFile]);

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">{label}</Label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border p-3",
          isDragging ? "border-dashed bg-muted/50" : "border-muted",
        )}
        aria-busy={isDragging}
      >
        {preview ? (
          <div className="flex items-center gap-4">
            <img
              src={
                preview ||
                "/placeholder.svg?height=96&width=96&query=Image%20placeholder"
              }
              alt={`${label} preview`}
              className="h-24 w-24 rounded-xl object-cover border"
              loading="lazy"
              decoding="async"
            />
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                id={inputId}
                type="file"
                name={name}
                accept="image/*"
                className="hidden"
                onChange={onPick}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onReplaceClick}
                className="gap-2 bg-transparent"
              >
                <Upload className="size-4" />
                Rasmni almashtir
              </Button>
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClear}
                  className="gap-2"
                >
                  <X className="size-4" />
                  O'chirish
                </Button>
              )}
            </div>
          </div>
        ) : (
          <label
            htmlFor={emptyInputId}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 hover:bg-muted/50",
            )}
          >
            <input
              disabled={isDragging || disabled}
              id={emptyInputId}
              type="file"
              name={name}
              accept="image/*"
              className="hidden"
              onChange={onPick}
            />
            <ImageIcon className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Rasm yuklash yoki bu yerga tashlang
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

export const ImageInput = React.memo(ImageInputImpl);
