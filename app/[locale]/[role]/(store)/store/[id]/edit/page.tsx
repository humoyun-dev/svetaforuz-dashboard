"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { StoreForm, StoreType } from "@/types/store.type";

const Page = () => {
  const { id } = useParams<{ id: string }>();

  const { data: fetchedData, isLoading } = useFetch<StoreType>(`store/${id}/`);

  const [data, setData] = useState<StoreForm>();

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  return <div></div>;
};

export default Page;
