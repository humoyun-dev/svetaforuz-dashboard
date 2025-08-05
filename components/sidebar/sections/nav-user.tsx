"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings2,
  Sparkles,
  User2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { useEffect } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { UserType } from "@/types/user.type";
import { useTranslation } from "react-i18next";
import { clearAllCookies } from "@/lib/cookie";
import { openSettingsModal, useSettingsStore } from "@/hooks/use-settings";

function UserAvatar({ user }: { user: UserType }) {
  const name = `${user.first_name} ${user.last_name}`;
  return (
    <Avatar className="h-8 w-8 rounded-md">
      <AvatarImage
        className="object-cover"
        src={user.profile_image || undefined}
        alt={name}
      />
      <AvatarFallback className="rounded-md">
        {user.first_name?.[0] ?? "U"}
        {user.last_name?.[0] ?? "N"}
      </AvatarFallback>
    </Avatar>
  );
}

export function NavUser() {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const { isMobile } = useSidebar();
  const { t } = useTranslation();
  const { setOpen, open } = useSettingsStore();

  const { user: storedUser, setUser } = useUserStore();

  const { data: fetchedUser } = useFetch<UserType>("accounts/profile/me/", {
    enabled: isOnline,
  });

  const user = isOnline ? fetchedUser : storedUser;

  useEffect(() => {
    if (isOnline && fetchedUser) {
      setUser(fetchedUser);
    }
  }, [isOnline, fetchedUser]);

  if (!user) return null;

  const fullName = `${user.first_name} ${user.last_name}`;

  const handleChangeUser = () => {
    router.replace("/auth/login?changeaccount=" + user.id);
  };

  function handleLogout() {
    clearAllCookies();
    localStorage.removeItem("user-storage");
    localStorage.removeItem("shop-storage");
    localStorage.removeItem("currency-storage");

    const usersRaw = localStorage.getItem("users");
    if (usersRaw !== null && storedUser) {
      try {
        const users: { user: UserType }[] = JSON.parse(usersRaw);
        const updatedUsers = users.filter((n) => n.user.id !== storedUser.id);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
      }
    }

    router.push("/auth/login");
  }

  function openSettings() {
    openSettingsModal();
    setOpen(true);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="end"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/*<DropdownMenuSeparator />*/}

            {/*<DropdownMenuGroup>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <Sparkles />*/}
            {/*    {t("profile.upgradeToPro", "Pro versiyaga o‘tish")}*/}
            {/*  </DropdownMenuItem>*/}
            {/*</DropdownMenuGroup>*/}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={openSettings}>
                <Settings2 />
                {t("profile.settings", "Sozlamalar")}
              </DropdownMenuItem>
              {/*<DropdownMenuItem>*/}
              {/*  <BadgeCheck />*/}
              {/*  {t("profile.account", "Profil")}*/}
              {/*</DropdownMenuItem>*/}
              {/*<DropdownMenuItem>*/}
              {/*  <CreditCard />*/}
              {/*  {t("profile.billing", "To‘lovlar")}*/}
              {/*</DropdownMenuItem>*/}
              <DropdownMenuItem>
                <Bell />
                {t("profile.notifications", "Bildirishnomalar")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleChangeUser}>
              <User2 />
              {t("profile.switchProfile", "Foydalanuvchini almashtirish")}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t("profile.logOut", "Chiqish")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
