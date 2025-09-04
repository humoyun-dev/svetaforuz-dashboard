"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { SearchLoading } from "@/components/loading/loading";

interface Option {
  label: string;
  value: string;
}

interface Props {
  data: Option[];
  title: string;
  value: any;
  setValue: (value: any) => void;
  search: string;
  setSearch: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  data,
  title,
  setValue,
  value,
  search,
  setSearch,
  className,
  isLoading = false,
  disabled = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`w-full justify-between ${className}`}
        >
          {value
            ? data.find((item) => item.value == value)?.label
            : `${t("place_holders.select")} ${title}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96 z-[9999] p-0">
        <Command>
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("place_holders.search")} ${title}...`}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="flex items-center !h-[15vh]">
                <SearchLoading />
              </div>
            ) : (
              <>
                {data.length === 0 ? (
                  <CommandEmpty>No {title} found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {data.map((item, index) => (
                      <CommandItem
                        className={`cursor-pointer`}
                        key={index}
                        value={item.value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
