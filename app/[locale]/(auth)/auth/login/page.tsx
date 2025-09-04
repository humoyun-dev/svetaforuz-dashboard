"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PhoneNumber, {
  type PhoneValidation,
} from "@/components/ui/phone-number";
import { notify } from "@/lib/toast";
import { useDeviceStore } from "@/stores/device.store";
import { authCookies } from "@/lib/cookie";
import { useUserStore } from "@/stores/user.store";
import { UserType } from "@/types/user.type";

interface FormData {
  phone_number: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: UserType;
}

export default function LoginPage() {
  const [form, setForm] = useState<FormData>({
    phone_number: "",
    password: "",
    rememberMe: true,
  });

  const { device } = useDeviceStore();
  const { setUser } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [phoneValidation, setPhoneValidation] =
    useState<PhoneValidation | null>(null);
  const { t } = useTranslation("auth");
  const router = useRouter();

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhoneChange = (phone: string, validation?: PhoneValidation) => {
    handleInputChange("phone_number", phone);
    setPhoneValidation(validation || null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.phone_number.trim()) {
      newErrors.phone_number =
        t("form_validation.phone_number_required") ||
        "Phone number is required";
    } else if (phoneValidation && !phoneValidation.isValid) {
      newErrors.phone_number =
        phoneValidation.errorMessage || "Invalid phone number";
    } else if (!phoneValidation) {
      newErrors.phone_number =
        t("form_validation.invalid_phone") ||
        "Please enter a valid phone number";
    }

    if (!form.password.trim()) {
      newErrors.password =
        t("form_validation.password_required") || "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        t("form_validation.password_min_length") ||
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (formData: FormData): Promise<LoginResponse> => {
    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}accounts/login/`,
      {
        identifier: formData.phone_number,
        password: formData.password,
        device: device,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (status !== 200) {
      throw new Error(t("login.login_error") || "Login failed");
    }

    return data;
  };

  const updateStoredUsers = (newAccount: LoginResponse) => {
    try {
      const storedData = localStorage.getItem("users");
      const storedDataArray = storedData ? JSON.parse(storedData) : [];

      const updatedAccounts = storedDataArray.filter(
        (item: any) => item.user.phone_number !== newAccount.user.phone_number,
      );

      const updatedUsers = [...updatedAccounts, newAccount];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Failed to update stored users:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notify.warning(
        t("form_validation.fix_errors") || "Please fix the form errors",
        {
          description:
            t("form_validation.check_fields") ||
            "Check the highlighted fields and try again",
          duration: 4000,
        },
      );
      return;
    }

    setLoading(true);

    try {
      const loginData = await notify.promise(
        handleLogin(form),
        {
          loading: t("login.logging_in") || "Signing in...",
          success: t("login.login_success") || "Welcome back!",
          error: (error: any) => {
            if (error.response?.status === 401) {
              return (
                t("form_validation.invalid_credentials") ||
                "Invalid phone number or password"
              );
            }
            if (error.response?.status === 429) {
              return (
                t("login.too_many_attempts") ||
                "Too many login attempts. Please try again later."
              );
            }
            if (error.code === "ECONNABORTED") {
              return (
                t("login.timeout_error") ||
                "Login request timed out. Please try again."
              );
            }
            return t("login.login_error") || "Login failed. Please try again.";
          },
        },
        {
          duration: 4000,
        },
      );

      if (form.rememberMe) {
        updateStoredUsers(loginData);
        authCookies.setTokens(loginData.access, loginData.refresh);
      }

      setUser(loginData.user);

      setForm({ phone_number: "", password: "", rememberMe: false });
      setErrors({});
      setPhoneValidation(null);

      router.push("/sellect");
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setErrors({
          phone_number:
            t("form_validation.invalid_credentials") || "Invalid credentials",
          password:
            t("form_validation.invalid_credentials") || "Invalid credentials",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = phoneValidation?.isValid && form.password.length >= 6;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("login.title") || "Sign In"}
          </CardTitle>
          <CardDescription className="text-center">
            {t("login.description") ||
              "Enter your phone number and password to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone-number">
                {t("login.phone_number") || "Phone Number"}
              </Label>
              <PhoneNumber
                id="phone-number"
                value={form.phone_number}
                onChange={handlePhoneChange}
                onValidate={(validation) => {
                  if (
                    form.phone_number &&
                    !validation.isValid &&
                    validation.errorMessage
                  ) {
                    setErrors((prev) => ({
                      ...prev,
                      phone_number: validation.errorMessage,
                    }));
                  } else if (validation.isValid) {
                    setErrors((prev) => ({ ...prev, phone_number: "" }));
                  }
                }}
                error={!!errors.phone_number}
                disabled={loading}
                placeholder={
                  t("login.phone_number_placeholder") ||
                  "Enter your phone number"
                }
                enableValidation
              />

              {errors.phone_number && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {t("login.password") || "Password"}
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  tabIndex={loading ? -1 : 0}
                >
                  {t("login.forgot_password") || "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={
                    errors.password ? "border-destructive pr-10" : "pr-10"
                  }
                  disabled={loading}
                  placeholder={
                    t("login.password_placeholder") || "Enter your password"
                  }
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleShowPassword}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={form.rememberMe}
                onCheckedChange={(checked) =>
                  handleInputChange("rememberMe", checked as boolean)
                }
                disabled={loading}
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("login.remember_me") || "Remember me for 30 days"}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.signing_in") || "Signing in..."}
                </>
              ) : (
                t("login.sign_in") || "Sign In"
              )}
            </Button>

            {!isFormValid && (form.phone_number || form.password) && (
              <p className="text-xs text-muted-foreground text-center">
                {!phoneValidation?.isValid
                  ? t("form_validation.invalid_phone") ||
                    "Please enter a valid phone number"
                  : form.password.length < 6
                    ? t("form_validation.password_min_length") ||
                      "Password must be at least 6 characters"
                    : ""}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
