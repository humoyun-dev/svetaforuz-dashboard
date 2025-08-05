"use client";

import React, { useEffect } from "react";
import { Loading } from "@/components/loading/loading";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.push(`${id}/edit`);
  }, [id]);

  return <Loading />;
};

export default Page;
