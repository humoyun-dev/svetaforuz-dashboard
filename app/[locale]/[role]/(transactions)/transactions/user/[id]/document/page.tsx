"use client";

import React, { useEffect } from "react";
import { Loading } from "@/components/loading/loading";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";

const Page = () => {
  const router = useRouter();
  const { role } = useUserStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.push(`/${role}/transactions/user/${id}`);
  }, [id, role]);

  return <Loading />;
};

export default Page;
