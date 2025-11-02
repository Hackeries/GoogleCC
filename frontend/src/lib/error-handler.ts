import { toast } from "sonner";
import type { AxiosError } from "axios";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * 🔧 Handle API errors consistently across the app
 */
export const handleApiError = (
  error: unknown,
  defaultMessage = "An error occurred"
): AppError => {
  console.error("[App] API Error:", error);

  // ✅ Axios error
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;

    const message =
      (data?.message as string) || (data?.error as string) || defaultMessage;

    // ✅ Properly typed and const-safe
    const rawErrorCode = data?.errorCode;
    const code: string =
      typeof rawErrorCode === "number"
        ? `ERR_${rawErrorCode}`
        : typeof rawErrorCode === "string"
        ? rawErrorCode
        : `HTTP_${String(status ?? 500)}`;

    return {
      message,
      code,
      status,
      details: data,
    };
  }

  // 🌐 Network error
  if (error instanceof Error && error.message.includes("Network")) {
    return {
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
      details: error,
    };
  }

  // ⏱ Timeout error
  if (
    error instanceof Error &&
    "code" in error &&
    (error as { code: string }).code === "ECONNABORTED"
  ) {
    return {
      message: "Request timeout. Please try again.",
      code: "TIMEOUT_ERROR",
      details: error,
    };
  }

  // 💥 Generic JS error
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      code: "JS_ERROR",
      details: error,
    };
  }

  // 🧩 Fallback
  return {
    message: defaultMessage,
    code: "UNKNOWN_ERROR",
    details: error,
  };
};

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * 🚨 Show error toast
 */
export const showErrorToast = (
  error: unknown,
  defaultMessage = "Something went wrong"
): AppError => {
  const appError = handleApiError(error, defaultMessage);
  toast.error(appError.message, {
    description:
      appError.code === "HTTP_500" ? "Our team has been notified" : undefined,
    duration: 5000,
  });
  return appError;
};

/**
 * ✅ Show success toast
 */
export const showSuccessToast = (
  message: string,
  description?: string
): void => {
  toast.success(message, { description, duration: 3000 });
};

/**
 * ⏳ Show loading toast
 */
export const showLoadingToast = (message: string): string => {
  return String(toast.loading(message));
};

/**
 * 🧩 Validate required fields
 */
export const validateRequired = (
  fields: Record<string, unknown>,
  fieldNames: string[]
): string | null => {
  for (const fieldName of fieldNames) {
    const value = fields[fieldName];
    if (value == null || (typeof value === "string" && value.trim() === "")) {
      return `${fieldName} is required`;
    }
  }
  return null;
};

/**
 * 📧 Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 🧠 Safe JSON parse
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("[App] JSON parse error:", error);
    return fallback;
  }
};
