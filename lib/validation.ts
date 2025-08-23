import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  out_price: z.string().min(1, "Price must be at least 0"),

  currency: z.enum(["USD", "UZS"]),
  count_type: z.string().min(1),
  in_stock: z.boolean(),

  stock: z.array(
    z.object({
      quantity: z.string().min(1, "Price must be at least 0"),
      unit_price: z.string().min(1, "Price must be at least 0"),
      currency: z.enum(["USD", "UZS"]),
      is_warehouse: z.boolean(),
    }),
  ),
  category: z.string(),

  properties: z
    .array(
      z.object({
        feature: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .optional()
    .refine(
      (items) => {
        if (!items) return true;
        const features = items.map((i) => i.feature.toLowerCase().trim());
        return new Set(features).size === features.length;
      },
      { message: "Duplicate feature names in properties" },
    )
    .optional(),

  images: z
    .array(
      z.object({
        image: z.instanceof(File),
      }),
    )
    .optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const productEditSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  out_price: z.string().min(1, "Price must be at least 0"),
  currency: z.enum(["USD", "UZS"]),
  count_type: z.string().min(1),
  in_stock: z.boolean(),
  category: z.string(),
});

export type ProductEditData = z.infer<typeof productEditSchema>;

export type CommonForm = UseFormReturn<ProductFormData | ProductEditData>;
