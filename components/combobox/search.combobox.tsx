"use client";

import { useMemo, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { Combobox } from "@/components/combobox/combobox";

export interface ComboboxOption {
  label: string;
  value: string;
}

interface SearchableComboboxProps<T> {
  endpoint: (search: string) => string;
  value: string | number;
  setValue: (value: string) => void;
  mapData: (item: T) => ComboboxOption;
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function SearchableCombobox<T>({
  endpoint,
  value,
  setValue,
  mapData,
  className,
  title = "Select",
  disabled = false,
}: SearchableComboboxProps<T>) {
  const [search, setSearch] = useState<string>("");

  const { data = [], isLoading } = useFetch<T[]>(endpoint(search));

  const options = useMemo<ComboboxOption[]>(() => {
    return data.map(mapData);
  }, [data, mapData]);

  return (
    <Combobox
      disabled={disabled}
      className={className}
      title={title}
      value={value}
      setValue={setValue}
      isLoading={isLoading}
      data={options}
      search={search}
      setSearch={setSearch}
    />
  );
}
