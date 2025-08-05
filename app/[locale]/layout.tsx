import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import initTranslations from "@/i18n";
import TranslationProvider from "@/providers/translate-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ConnectionStatus from "@/components/connection-status";
import ConnectionSpeedWarning from "@/components/network-quality";

const sfProDisplay = localFont({
  variable: "--font-sf-pro", // This is the CSS variable used below
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
  src: [
    {
      path: "../../public/fonts/SFProDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-UltralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-HeavyItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Svetafor.uz",
  description:
    "Sellers Svetafor.uz — bu avto ehtiyot qismlar do‘konlari uchun mo‘ljallangan, savdo, ombor boshqaruvi va mijozlar bilan ishlashni soddalashtiruvchi zamonaviy POS tizimi bilan integratsiyalashgan kuchli platformadir.",
  metadataBase: new URL("https://seller.svetafor.uz"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ru-RU": "/ru",
      "uz-UZ": "/uz",
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/app-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seller.svetafor.uz/",
    siteName: "Sellers Svetafor.uz",
    title:
      "Sellers Svetafor.uz — POS integratsiyasi bilan avto ehtiyot qismlar savdosini transformatsiya qiling",
    description:
      "Sellers Svetafor.uz yordamida savdo jarayonlaringizni avtomatlashtiring, operatsion samaradorlikni oshiring va zamonaviy POS tizimi orqali biznesingizni keyingi bosqichga olib chiqing.",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Sellers Svetafor.uz — Sizning ishonchli savdo hamkoringiz",
      },
    ],
    phoneNumbers: ["+998946717170", "+998330257501"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sellerssvetafor",
    title:
      "Sellers Svetafor.uz — POS integratsiyasi orqali avto ehtiyot qismlar savdosini soddalashtiring",
    description:
      "Minglab avto ehtiyot qismlar sotuvchilari tomonidan tanlangan platforma — Sellers Svetafor.uz bilan siz ham bugunoq rivojlanishni boshlang.",
    images: "/banner.jpg",
  },
  appleWebApp: true,
  authors: [
    {
      name: "Humoyunbek",
      url: "https://www.humoyundev.uz/",
    },
  ],
  keywords: [
    "avto ehtiyot qismlar savdosi",
    "POS tizimi",
    "ombor boshqaruvi",
    "chakana avtomobil bozori",
    "sotuvchilar platformasi",
    "savdo jarayonlarini avtomatlashtirish",
    "raqamli transformatsiya",
    "Sellers Svetafor.uz",
  ],
  manifest: "/manifest.json",
};

const i18nNamespaces = ["layout"];

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${sfProDisplay.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider
            locale={locale}
            resources={resources}
            namespaces={i18nNamespaces}
          >
            <>
              {/*<ConnectionSpeedWarning />*/}
              {/*<ConnectionStatus />*/}
              {children}
              <Toaster />
            </>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
