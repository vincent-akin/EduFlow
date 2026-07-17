"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/lib/api/auth";

const SESSION_COOKIE = "eduflow_session";

function setSessionCookie(present: boolean) {
  if (typeof document === "undefined") return;
  if (present) {
    document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  } else {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  }
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isDemo: boolean;
  setSession: (session: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setDemoSession: (user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isDemo: false,
      setSession: ({ user, accessToken, refreshToken }) => {
        setSessionCookie(true);
        set({ user, accessToken, refreshToken, isDemo: false });
      },
      setDemoSession: (user) => {
        setSessionCookie(true);
        set({ user, accessToken: "demo", refreshToken: "demo", isDemo: true });
      },
      setAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => {
        setSessionCookie(false);
        set({ user: null, accessToken: null, refreshToken: null, isDemo: false });
      },
    }),
    {
      name: "eduflow-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isDemo: state.isDemo,
      }),
    }
  )
);
