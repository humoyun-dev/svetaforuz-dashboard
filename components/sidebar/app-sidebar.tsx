"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/sections/nav-main";
import { NavProjects } from "@/components/sidebar/sections/nav-projects";
import { NavUser } from "@/components/sidebar/sections/nav-user";
import { StoreSwitcher } from "@/components/sidebar/sections/store-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { getData } from "@/lib/sidebar";
import { StaffType } from "@/types/user.type";
import { useUserStore } from "@/stores/user.store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { role } = useUserStore();

  const data = React.useMemo(() => getData({ type: role, t }), [role, t]);

  return (
    <Sidebar variant={`floating`} collapsible="icon" {...props}>
      <SidebarHeader>
        <StoreSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
