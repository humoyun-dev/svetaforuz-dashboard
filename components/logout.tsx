import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAllCookies } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { UserType } from "@/types/user.type";
import { useUserStore } from "@/stores/user.store";

export const LogoutIconButton = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setIsLogoutDialogOpen(true)}
      >
        <LogOut className="h-5 w-5" />
      </Button>

      <DialogDeleteAlert
        isLogoutDialogOpen={isLogoutDialogOpen}
        setIsLogoutDialogOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

const DialogDeleteAlert = ({
  isLogoutDialogOpen,
  setIsLogoutDialogOpen,
}: {
  isLogoutDialogOpen: boolean;
  setIsLogoutDialogOpen: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { user: storedUser } = useUserStore();

  const router = useRouter();

  const handleLogout = () => {
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
  };

  return (
    <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("logoutConfirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("logoutDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("no")}</AlertDialogCancel>
          <AlertDialogAction
            className={`bg-destructive text-white dark:text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60`}
            asChild
          >
            <Button onClick={handleLogout} variant={"destructive"}>
              {t("yes")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
