import { toast } from "sonner";
import type React from "react";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions {
  description?: string;
  style?: React.CSSProperties;
  id?: string | number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationManager {
  private loadingToasts = new Map<string | number, boolean>();

  private static readonly THEME_STYLES = Object.freeze({
    success: Object.freeze({
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      border: "1px solid hsl(var(--primary))",
    }),
    error: Object.freeze({
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      border: "1px solid hsl(var(--destructive))",
    }),
    warning: Object.freeze({
      background: "hsl(39 84% 56%)",
      color: "hsl(0 0% 100%)",
      border: "1px solid hsl(39 84% 56%)",
    }),
    info: Object.freeze({
      background: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
      border: "1px solid hsl(var(--border))",
    }),
    loading: Object.freeze({
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
    }),
  } as const);

  private static readonly BASE_STYLE = Object.freeze({
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
  });

  private getToastStyle(
    type: ToastType,
    customStyle?: React.CSSProperties,
  ): React.CSSProperties {
    return customStyle
      ? {
          ...NotificationManager.THEME_STYLES[type],
          ...NotificationManager.BASE_STYLE,
          ...customStyle,
        }
      : {
          ...NotificationManager.THEME_STYLES[type],
          ...NotificationManager.BASE_STYLE,
        };
  }

  /**
   * Show a toast notification
   */
  show(
    type: ToastType,
    message: string,
    options?: ToastOptions,
  ): string | number {
    const toastStyle = this.getToastStyle(type, options?.style);
    const toastOptions = {
      ...options,
      style: toastStyle,
    };

    const toastId = toast[type](message, toastOptions);

    if (type === "loading") {
      this.loadingToasts.set(toastId, true);
    }

    return toastId;
  }

  updateById(
    id: string | number,
    type: Exclude<ToastType, "loading">,
    message: string,
    options?: ToastOptions,
  ): boolean {
    if (!this.loadingToasts.has(id)) {
      console.warn(`No loading toast found with ID: ${id}`);
      return false;
    }

    const toastStyle = this.getToastStyle(type, options?.style);

    toast[type](message, {
      ...options,
      id,
      style: toastStyle,
    });

    this.loadingToasts.delete(id);
    return true;
  }

  /**
   * Update the most recent loading toast (legacy method for backward compatibility)
   */
  update(
    type: Exclude<ToastType, "loading">,
    message: string,
    options?: ToastOptions,
  ): boolean {
    const loadingIds = Array.from(this.loadingToasts.keys());
    if (loadingIds.length === 0) {
      console.warn("No active loading toast to update");
      return false;
    }

    const mostRecentId = loadingIds[loadingIds.length - 1];
    return this.updateById(mostRecentId, type, message, options);
  }

  dismiss(id?: string | number): void {
    if (id) {
      toast.dismiss(id);
      this.loadingToasts.delete(id);
    } else {
      toast.dismiss();
      this.loadingToasts.clear();
    }
  }

  success = (
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number => this.show("success", message, options);

  error = (
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number => this.show("error", message, options);

  warning = (
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number => this.show("warning", message, options);

  info = (
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number => this.show("info", message, options);

  loading = (
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number => this.show("loading", message, options);

  /**
   * Show a promise-based toast that updates based on promise state
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions,
  ): Promise<T> {
    const loadingId = this.loading(messages.loading, options);

    return promise
      .then((data) => {
        const message =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;
        this.updateById(loadingId, "success", message, options);
        return data;
      })
      .catch((error) => {
        const message =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;
        this.updateById(loadingId, "error", message, options);
        throw error;
      });
  }

  hasLoadingToasts(): boolean {
    return this.loadingToasts.size > 0;
  }

  getLoadingToastCount(): number {
    return this.loadingToasts.size;
  }
}

export const notify = new NotificationManager();
export { NotificationManager };
export type { ToastType, ToastOptions };
