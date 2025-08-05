"use client";
import React, { useEffect } from "react";
import { useTokenGuard } from "@/hooks/use-guard";
import { Loading } from "@/components/loading/loading";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/hooks/use-online-status";

const Page = () => {
  const router = useRouter();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      router.push("/sellect");
    }

    useTokenGuard;
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Page;
