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
  private activeToastId: string | number | null = null;

  private static readonly THEME_STYLES = {
    success: {
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      border: "1px solid hsl(var(--primary))",
    },
    error: {
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      border: "1px solid hsl(var(--destructive))",
    },
    warning: {
      background: "hsl(39 84% 56%)",
      color: "hsl(0 0% 100%)",
      border: "1px solid hsl(39 84% 56%)",
    },
    info: {
      background: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
      border: "1px solid hsl(var(--border))",
    },
    loading: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
    },
  } as const;

  private getToastStyle(
    type: ToastType,
    customStyle?: React.CSSProperties,
  ): React.CSSProperties {
    return {
      ...NotificationManager.THEME_STYLES[type],
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      ...customStyle,
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

    if (type === "loading") {
      this.activeToastId = toast.loading(message, toastOptions);
      return this.activeToastId;
    }

    return toast[type](message, toastOptions);
  }

  /**
   * Update an existing loading toast
   */
  update(
    type: Exclude<ToastType, "loading">,
    message: string,
    options?: ToastOptions,
  ): void {
    if (!this.activeToastId) {
      console.warn("No active loading toast to update");
      return;
    }

    const toastStyle = this.getToastStyle(type, options?.style);

    toast[type](message, {
      ...options,
      id: this.activeToastId,
      style: toastStyle,
    });

    this.activeToastId = null;
  }

  /**
   * Dismiss a specific toast or all toasts
   */
  dismiss(id?: string | number): void {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }

    if (id === this.activeToastId || !id) {
      this.activeToastId = null;
    }
  }

  /**
   * Convenience methods for common toast types
   */
  success(
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number {
    return this.show("success", message, options);
  }

  error(message: string, options?: Omit<ToastOptions, "id">): string | number {
    return this.show("error", message, options);
  }

  warning(
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number {
    return this.show("warning", message, options);
  }

  info(message: string, options?: Omit<ToastOptions, "id">): string | number {
    return this.show("info", message, options);
  }

  loading(
    message: string,
    options?: Omit<ToastOptions, "id">,
  ): string | number {
    return this.show("loading", message, options);
  }

  /**
   * Show a promise-based toast that updates based on promise state
   */
  promise<T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions,
  ): Promise<T> {
    const loadingId = this.loading(loadingMessage, options);

    return promise
      .then((data) => {
        const message =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;
        this.update("success", message, options);
        return data;
      })
      .catch((error) => {
        const message =
          typeof errorMessage === "function"
            ? errorMessage(error)
            : errorMessage;
        this.update("error", message, options);
        throw error;
      });
  }
}

export const notify = new NotificationManager();

export { NotificationManager };

export type { ToastType, ToastOptions };
