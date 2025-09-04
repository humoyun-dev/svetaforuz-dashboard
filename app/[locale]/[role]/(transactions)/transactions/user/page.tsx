"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";

const Page = () => {
  const router = useRouter();
  const { role } = useUserStore();

  useEffect(() => {
    router.push(`/${role}/transactions`);
  }, [router, role]);

  return null;
};

export default Page;
