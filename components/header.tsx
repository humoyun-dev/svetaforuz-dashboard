"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CurrencyToggle from "@/components/togglies/currency.togglie";

interface HeaderProps {
  actions?: React.ReactNode;
}

const Header = ({ actions }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="size-8"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Ortga</span>
        </Button>

        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <DynamicBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        {actions && (
          <>
            {actions}
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        <CurrencyToggle />
      </div>
    </header>
  );
};

export default Header;
