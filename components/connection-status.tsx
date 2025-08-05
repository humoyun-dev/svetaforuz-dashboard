"use client";

import { AlertCircle } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-destructive text-white text-sm w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5 text-white" />
        <span className="font-medium">
          Internet aloqasi uzildi. Ayrim imkoniyatlar vaqtincha ishlamasligi
          mumkin.
        </span>
      </div>
    </div>
  );
}
