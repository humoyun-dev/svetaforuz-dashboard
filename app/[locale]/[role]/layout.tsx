"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useGuard } from "@/hooks/use-guard";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loading } from "@/components/loading/loading";
import { useUserRateCheck } from "@/hooks/use-check-rate";
import { getCookie } from "@/lib/cookie";
import SettingsModal from "@/components/modals/settings.modal";
import DeleteStoreModal from "@/components/modals/delete-store.modal";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useGuard();
  useUserRateCheck();

  const [defaultOpenSidebar, setSidebarOpen] = useState<boolean>();

  useEffect(() => {
    const defaultOpen = getCookie("sidebar:state") === "true";

    setSidebarOpen(Boolean(defaultOpen));
  }, []);

  return (
    <>
      {typeof defaultOpenSidebar === "boolean" && (
        <SidebarProvider defaultOpen={defaultOpenSidebar}>
          <AppSidebar />
          <SidebarInset>
            <Suspense fallback={<Loading />}>
              <div className="px-3 h-min-screen">{children}</div>
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
      )}
      <SettingsModal />
      <DeleteStoreModal />
    </>
  );
};

export default Layout;
