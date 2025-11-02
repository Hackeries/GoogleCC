"use client";

import { useCallback } from "react";
import {
  showErrorToast,
  handleApiError,
  type AppError,
} from "@/lib/error-handler";

/**
 * A custom hook to handle API errors and display appropriate toast messages.
 */
export const useApiError = () => {
  /**
   * Handles API errors by parsing and showing an error toast.
   *
   * @param error - The unknown error object (can be AxiosError, Fetch error, etc.)
   * @param defaultMessage - Fallback message if no specific message is found.
   * @returns Parsed AppError with message and status info.
   */
  const handleError = useCallback(
    (error: unknown, defaultMessage?: string): AppError => {
      const appError = handleApiError(error, defaultMessage);
      showErrorToast(appError, defaultMessage);
      return appError;
    },
    []
  );

  /**
   * Extracts a readable message from an API error.
   *
   * @param error - The unknown error object.
   * @param defaultMessage - Message to return if no specific one is available.
   * @returns A human-readable error message.
   */
  const getErrorMessage = useCallback(
    (error: unknown, defaultMessage = "An error occurred"): string => {
      return handleApiError(error, defaultMessage).message;
    },
    []
  );

  return {
    handleError,
    getErrorMessage,
  };
};
