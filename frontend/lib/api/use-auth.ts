"use client";

import { useMutation } from "@tanstack/react-query";

import { login, register } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
