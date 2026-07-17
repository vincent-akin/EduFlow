"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { ApiError } from "@/lib/api/client";
import { useLogin } from "@/lib/api/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { demoUsers } from "@/lib/mock/demo-users";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const setDemoSession = useAuthStore((state) => state.setDemoSession);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        router.push(roleHome(data.user.role));
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
        Welcome back
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to pick up where your school left off.
      </p>

      {loginMutation.isError && (
        <Alert className="mt-6">{errorMessage(loginMutation.error)}</Alert>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pr-10"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <Checkbox />
          Keep me signed in
        </label>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to EduFlow?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create a school account
        </Link>
      </p>

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          No backend running? Explore a demo
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(demoUsers) as Array<keyof typeof demoUsers>).map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setDemoSession(demoUsers[role]);
                router.push(roleHome(role));
              }}
            >
              {roleDisplay(role)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function roleHome(role: string) {
  switch (role) {
    case "school_admin":
      return "/dashboard/admin";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    case "parent":
      return "/dashboard/parent";
    default:
      return "/dashboard";
  }
}

function roleDisplay(role: string) {
  switch (role) {
    case "school_admin":
      return "Admin";
    case "teacher":
      return "Teacher";
    case "student":
      return "Student";
    case "parent":
      return "Parent";
    default:
      return role;
  }
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}
