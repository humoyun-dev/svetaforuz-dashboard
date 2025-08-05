import { useEffect, useState } from "react";

export function useInternetSpeed(threshold = 800, interval = 5000): boolean {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const measurePing = async () => {
      const start = performance.now();
      try {
        await fetch("/ping.json" + Date.now(), { cache: "no-store" });
        const latency = performance.now() - start;
        setIsSlow(latency > threshold);
      } catch (error) {
        setIsSlow(true);
      }
      timeout = setTimeout(measurePing, interval);
    };

    measurePing();
    return () => clearTimeout(timeout);
  }, [threshold, interval]);

  return isSlow;
}
