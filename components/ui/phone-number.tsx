"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import PhoneInput, { type CountryData } from "react-phone-input-2";
import { useTranslation } from "react-i18next";

// Simple phone validation result
interface PhoneValidation {
  isValid: boolean;
  errorMessage?: string;
}

// Simple phone number component props
interface PhoneNumberProps {
  /** Current phone number value */
  value: string;
  /** Callback when phone number changes */
  onChange: (phone: string, validation?: PhoneValidation) => void;
  /** Whether the input has an error state */
  error?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Enable basic validation */
  enableValidation?: boolean;
  /** Custom validation callback */
  onValidate?: (validation: PhoneValidation) => void;
  /** Additional input props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** ID for the input (useful for labels) */
  id?: string;
}

/**
 * Basic phone number validation
 */
const validatePhone = (
  phone: string,
  t: (key: string) => string,
): PhoneValidation => {
  // Remove country code and non-digits
  const cleanPhone = phone.replace(/^\+?998/, "").replace(/\D/g, "");

  if (!cleanPhone) {
    return {
      isValid: false,
      errorMessage:
        t("form_validation.phone_number_required") ||
        "Phone number is required",
    };
  }

  if (cleanPhone.length < 7) {
    return {
      isValid: false,
      errorMessage:
        t("form_validation.phone_number_too_short") ||
        "Phone number is too short",
    };
  }

  if (cleanPhone.length > 9) {
    return {
      isValid: false,
      errorMessage:
        t("form_validation.phone_number_too_long") ||
        "Phone number is too long",
    };
  }

  return {
    isValid: true,
  };
};

/**
 * Simple PhoneNumber component for Uzbekistan
 */
const PhoneNumber: React.FC<PhoneNumberProps> = ({
  value,
  onChange,
  error = false,
  className,
  disabled = false,
  placeholder,
  enableValidation = true,
  onValidate,
  inputProps,
  id,
}) => {
  const { t } = useTranslation("auth");

  // Use translation for placeholder if not provided
  const translatedPlaceholder =
    placeholder || t("login.phone_number_placeholder") || "Enter phone number";

  // Handle phone number change
  const handlePhoneChange = (phone: string, countryData: CountryData) => {
    let validation: PhoneValidation | undefined;

    if (enableValidation) {
      validation = validatePhone(phone, t);
      onValidate?.(validation);
    }

    onChange(phone, validation);
  };

  // Input styling
  const inputClass = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    error &&
      "border-destructive ring-destructive focus-visible:ring-destructive",
    className,
  );

  return (
    <PhoneInput
      value={value}
      onChange={handlePhoneChange}
      country="uz"
      onlyCountries={["uz"]}
      countryCodeEditable={false}
      disableCountryCode={false}
      masks={{ uz: "(..) ... - .. - .." }}
      specialLabel=""
      placeholder={translatedPlaceholder}
      disabled={disabled}
      inputClass={inputClass}
      containerClass="phone-input-container"
      buttonClass="phone-button"
      inputProps={{
        ...inputProps,
        id,
        "aria-invalid": error,
        autoComplete: "tel",
      }}
      autoFormat={true}
      preserveOrder={["uz"]}
      copyNumbersOnly={true}
      jumpCursorToEnd={true}
    />
  );
};

// Export types
export type { PhoneNumberProps, PhoneValidation };

export default PhoneNumber;
