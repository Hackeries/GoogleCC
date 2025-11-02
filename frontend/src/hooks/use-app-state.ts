"use client";

import { useStore } from "@/store/store";
import { useCallback } from "react";
import { toast } from "sonner";

export const useAppState = () => {
  const store = useStore();

  const setUser = useCallback(
    (user: any) => {
      store.setUser(user);
    },
    [store]
  );

  const setAccessToken = useCallback(
    (token: string | null) => {
      store.setAccessToken(token);
    },
    [store]
  );

  const logout = useCallback(() => {
    store.clearUser?.();
    store.clearAccessToken?.();
    store.clearExpiresAt?.();
    toast.success("Logged out successfully");
    window.location.href = "/";
  }, [store]);

  const hasActiveSession = useCallback(() => {
    const token = store.accessToken;
    const expiresAt = store.expiresAt;

    if (!token) return false;
    if (!expiresAt) return true;

    return new Date().getTime() < expiresAt * 1000;
  }, [store.accessToken, store.expiresAt]);

  return {
    user: store.user,
    accessToken: store.accessToken,
    expiresAt: store.expiresAt,
    setUser,
    setAccessToken,
    logout,
    hasActiveSession: hasActiveSession(),
  };
};
