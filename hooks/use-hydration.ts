import { useEffect, useState } from "react";
import { useStore } from "@/stores/store.store";

export function useHydrationReady(): boolean {
  const [hydrated, setHydrated] = useState(false);
  const internalHydrated = useStore((s) => s._hasHydrated);

  useEffect(() => {
    if (internalHydrated) setHydrated(true);
  }, [internalHydrated]);

  return hydrated;
}
