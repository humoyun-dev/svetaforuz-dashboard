import {
  ArrowRightLeft,
  ChartArea,
  LifeBuoy,
  Package,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { StaffType } from "@/types/user.type";

export function getData({ type = "admin", t }: { type?: StaffType; t: any }) {
  const baseUrl = `/${type}`;

  const commonNavSecondary = [
    {
      title: t("navigation.support"),
      url: "https://t.me/moonlight_staff",
      icon: LifeBuoy,
    },
  ];

  const navByRole: Record<StaffType, { navMain: any[]; navSecondary: any[] }> =
    {
      admin: {
        navMain: [
          {
            title: t("navigation.analytics"),
            url: `${baseUrl}/analytics`,
            icon: ChartArea,
            items: [
              { title: t("navigation.general"), url: `${baseUrl}/analytics` },
              {
                title: t("navigation.store"),
                url: `${baseUrl}/analytics/store`,
              },
              {
                title: t("navigation.members"),
                url: `${baseUrl}/analytics/members`,
              },
              {
                title: t("navigation.products"),
                url: `${baseUrl}/analytics/products`,
              },
              {
                title: t("navigation.category"),
                url: `${baseUrl}/analytics/category`,
              },
            ],
          },
          {
            title: t("navigation.store"),
            url: `${baseUrl}/store`,
            icon: Store,
            items: [
              { title: t("navigation.list"), url: `${baseUrl}/store` },
              {
                title: t("navigation.balance"),
                url: `${baseUrl}/store/balance`,
              },
              {
                title: t("navigation.members"),
                url: `${baseUrl}/store/members`,
              },
              {
                title: t("navigation.settings"),
                url: `${baseUrl}/store/settings`,
              },
            ],
          },
          {
            title: t("navigation.orders"),
            url: `${baseUrl}/orders`,
            icon: ShoppingBasket,
          },
          {
            title: t("navigation.products"),
            url: `${baseUrl}/products`,
            icon: Package,
            items: [
              { title: t("navigation.list"), url: `${baseUrl}/products` },
              {
                title: t("navigation.imported"),
                url: `${baseUrl}/products/imports`,
              },
              {
                title: t("navigation.exported"),
                url: `${baseUrl}/products/exports`,
              },
            ],
          },
          {
            title: t("navigation.transactions"),
            url: `${baseUrl}/transactions`,
            icon: ArrowRightLeft,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      manager: {
        navMain: [
          {
            title: t("navigation.orders"),
            url: `${baseUrl}/orders`,
            icon: ShoppingBasket,
          },
          {
            title: t("navigation.products"),
            url: `${baseUrl}/products`,
            icon: Package,
            items: [
              { title: t("navigation.list"), url: `${baseUrl}/products` },
              {
                title: t("navigation.imported"),
                url: `${baseUrl}/products/imports`,
              },
              {
                title: t("navigation.exported"),
                url: `${baseUrl}/products/exports`,
              },
            ],
          },
          {
            title: t("navigation.transactions"),
            url: `${baseUrl}/transactions`,
            icon: ArrowRightLeft,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      seller: {
        navMain: [
          {
            title: t("navigation.orders"),
            url: `${baseUrl}/orders`,
            icon: ShoppingBasket,
          },
          {
            title: t("navigation.products"),
            url: `${baseUrl}/products`,
            icon: Package,
          },
          {
            title: t("navigation.transactions"),
            url: `${baseUrl}/transactions`,
            icon: ArrowRightLeft,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      deliverer: {
        navMain: [
          {
            title: t("navigation.orders"),
            url: `${baseUrl}/orders`,
            icon: ShoppingBasket,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      cashier: {
        navMain: [
          {
            title: t("navigation.transactions"),
            url: `${baseUrl}/transactions`,
            icon: ArrowRightLeft,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      stockman: {
        navMain: [
          {
            title: t("navigation.products"),
            url: `${baseUrl}/products`,
            icon: Package,
          },
        ],
        navSecondary: commonNavSecondary,
      },
      viewer: {
        navMain: [
          {
            title: t("navigation.analytics"),
            url: `${baseUrl}/analytics`,
            icon: ChartArea,
          },
        ],
        navSecondary: commonNavSecondary,
      },
    };

  return navByRole[type] ?? null;
}
