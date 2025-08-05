import type { CountType } from "@/types/products.type";

export const COUNT_TYPES: { value: CountType; label: string }[] = [
  { value: "D", label: "Days" },
  { value: "L", label: "Liters" },
  { value: "ML", label: "Milliliters" },
  { value: "KG", label: "Kilograms" },
  { value: "G", label: "Grams" },
  { value: "MG", label: "Milligrams" },
  { value: "T", label: "Tons" },
  { value: "M", label: "Meters" },
  { value: "CM", label: "Centimeters" },
  { value: "MM", label: "Millimeters" },
  { value: "IN", label: "Inches" },
  { value: "FT", label: "Feet" },
  { value: "YD", label: "Yards" },
  { value: "PKG", label: "Package" },
  { value: "BOX", label: "Box" },
  { value: "SET", label: "Set" },
  { value: "PAIR", label: "Pair" },
  { value: "ROLL", label: "Roll" },
  { value: "PCS", label: "Pieces" },
];

export const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "UZS", label: "UZS" },
] as const;
