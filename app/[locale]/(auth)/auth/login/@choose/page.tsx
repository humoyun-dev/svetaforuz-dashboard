"use client";

import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authCookies, removeCookie, setSecureCookie } from "@/lib/cookie";
import { formatedPhoneNumber } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserType } from "@/types/user.type";
import { useUserStore } from "@/stores/user.store";
import { useStore } from "@/stores/store.store";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface AccountType {
  access: string;
  refresh: string;
  user: UserType;
}

const Page = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnline = useOnlineStatus();

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { clearUser } = useUserStore();
  const { clearState } = useStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const raw = localStorage.getItem("users");
    if (!raw) return;

    try {
      const parsed: AccountType[] = JSON.parse(raw);
      setAccounts(parsed);

      const userId = searchParams.get("changeaccount");
      if (userId) {
        setSelectedId(Number(userId));
      }
    } catch (err) {
      console.error("Invalid stored accounts:", err);
    }
  }, [searchParams]);

  const handleChangeAccount = useCallback(
    (account: AccountType) => {
      authCookies.removeTokens();
      removeCookie("path");

      if (isOnline) {
        clearUser();
        clearState();
      }

      setUser(account.user);

      authCookies.setTokens(account.access, account.refresh);
      router.push(`/`);
    },
    [router, isOnline],
  );

  const renderedAccounts = useMemo(
    () =>
      accounts.map((account, idx) => (
        <AccountCard
          key={idx}
          account={account}
          onClick={() => handleChangeAccount(account)}
          isSelected={selectedId === account.user.id}
        />
      )),
    [accounts, selectedId],
  );

  return (
    <Card className="mx-auto max-w-lg w-full shadow-none bg-transparent border-none">
      <CardHeader>
        <CardTitle>{t("account.choose_title")}</CardTitle>
        <CardDescription>{t("account.choose_description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 md:p-6 p-0">
        {renderedAccounts.length > 0 ? (
          renderedAccounts
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("account.no_accounts")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const AccountCard = memo(
  ({
    account,
    onClick,
    isSelected,
  }: {
    account: AccountType;
    onClick: () => void;
    isSelected?: boolean;
  }) => {
    const { user } = account;

    const initials =
      `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

    return (
      <div
        onClick={onClick}
        className={`border flex gap-4 cursor-pointer select-none rounded-lg p-4
          bg-background hover:shadow-lg
          ${isSelected ? "ring-2 ring-primary border-primary" : ""}
        `}
      >
        <Avatar className="rounded-md size-16">
          <AvatarImage
            className="object-cover"
            src={user.profile_image || ""}
            alt="avatar"
          />
          <AvatarFallback>{initials || "UN"}</AvatarFallback>
        </Avatar>
        <div className="flex w-full items-start flex-col">
          <h3 className="font-medium uppercase">
            {user.first_name} {user.last_name}
          </h3>
          <p>{formatedPhoneNumber(user.phone_number)}</p>
        </div>
      </div>
    );
  },
);
AccountCard.displayName = "AccountCard";

export default Page;
