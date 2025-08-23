"use client";

import type React from "react";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--success-bg": "hsl(142 76% 96%)",
          "--success-border": "hsl(142 76% 36%)",
          "--success-text": "hsl(142 76% 20%)",
          "--info-bg": "hsl(214 100% 96%)",
          "--info-border": "hsl(214 100% 50%)",
          "--info-text": "hsl(214 100% 25%)",
          "--warning-bg": "hsl(48 100% 96%)",
          "--warning-border": "hsl(48 96% 53%)",
          "--warning-text": "hsl(48 96% 25%)",
          "--error-bg": "hsl(0 93% 96%)",
          "--error-border": "hsl(0 84% 60%)",
          "--error-text": "hsl(0 84% 25%)",
          "--border-radius": "var(--radius)",
          "--toast-font": "inherit",
          "--toast-font-size": "14px",
          "--toast-icon-margin-start": "12px",
          "--toast-icon-margin-end": "16px",
          "--toast-svg-margin-start": "12px",
          "--toast-svg-margin-end": "16px",
          "--toast-button-margin-start": "auto",
          "--toast-button-margin-end": "12px",
          "--toast-close-button-start": "auto",
          "--toast-close-button-end": "12px",
          "--toast-close-button-transform": "none",
        } as React.CSSProperties
      }
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      gap={12}
      offset={16}
      toastOptions={{
        style: {
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--card-foreground))",
          borderRadius: "var(--radius)",
          fontSize: "14px",
          fontWeight: "500",
          padding: "16px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(8px)",
          animation:
            "toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1), toast-bounce 0.6s ease-out 0.1s",
        },
        className:
          "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
      }}
      {...props}
    />
  );
};

export { Toaster };
