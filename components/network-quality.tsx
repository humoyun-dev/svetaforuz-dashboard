"use client";

import { AlertCircle } from "lucide-react";
import { useInternetSpeed } from "@/hooks/use-network-quality";

export default function ConnectionSpeedWarning() {
  const isSlow = useInternetSpeed();

  if (!isSlow) return null;

  return (
    <div className="bg-yellow-500 text-white text-center py-2 text-sm w-full shadow-md rounded-b">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 px-4">
        <AlertCircle className="w-4 h-4" />
        <span>
          Internet aloqasi sekin ishlayapti — iltimos, signalni mustahkamlashga
          harakat qiling.
        </span>
      </div>
    </div>
  );
}
