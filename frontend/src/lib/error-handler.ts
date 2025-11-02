import { toast } from "sonner";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Handle API errors consistently across the app
 * Centralized error handling with proper logging
 */
export const handleApiError = (
  error: any,
  defaultMessage = "An error occurred"
): AppError => {
  console.error("[v0] API Error:", error);

  // Axios error
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    const message = data?.message || data?.error || defaultMessage;

    return {
      message,
      code: data?.errorCode || `HTTP_${status}`,
      status,
      details: data,
    };
  }

  // Network error
  if (error?.message?.includes("Network")) {
    return {
      message: "Network error. Please check your connection.",
      code: "NETWORK_ERROR",
      details: error,
    };
  }

  // Timeout error
  if (error?.code === "ECONNABORTED") {
    return {
      message: "Request timeout. Please try again.",
      code: "TIMEOUT_ERROR",
      details: error,
    };
  }

  // Unknown error
  return {
    message: error?.message || defaultMessage,
    code: "UNKNOWN_ERROR",
    details: error,
  };
};

/**
 * Show error toast with consistent formatting
 */
export const showErrorToast = (
  error: any,
  defaultMessage = "Something went wrong"
) => {
  const appError = handleApiError(error, defaultMessage);
  toast.error(appError.message, {
    description:
      appError.code !== "HTTP_500" ? undefined : "Our team has been notified",
    duration: 5000,
  });
  return appError;
};

/**
 * Show success toast with consistent formatting
 */
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

/**
 * Show loading toast (for long operations)
 */
export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

/**
 * Validate required fields
 */
export const validateRequired = (
  fields: Record<string, any>,
  fieldNames: string[]
): string | null => {
  for (const fieldName of fieldNames) {
    if (
      !fields[fieldName] ||
      (typeof fields[fieldName] === "string" && fields[fieldName].trim() === "")
    ) {
      return `${fieldName} is required`;
    }
  }
  return null;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = (json: string, fallback: any = null): any => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("[v0] JSON parse error:", error);
    return fallback;
  }
};
