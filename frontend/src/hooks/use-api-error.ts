"use client";

import { useCallback } from "react";
import {
  showErrorToast,
  handleApiError,
  type AppError,
} from "@/lib/error-handler";

export const useApiError = () => {
  const handleError = useCallback(
    (error: any, defaultMessage?: string): AppError => {
      const appError = handleApiError(error, defaultMessage);
      showErrorToast(error, defaultMessage);
      return appError;
    },
    []
  );

  const getErrorMessage = useCallback(
    (error: any, defaultMessage = "An error occurred"): string => {
      return handleApiError(error, defaultMessage).message;
    },
    []
  );

  return {
    handleError,
    getErrorMessage,
  };
};
