"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth-store";

const roleHome: Record<string, string> = {
  school_admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
};

export default function DashboardIndexPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    router.replace(user ? roleHome[user.role] ?? "/login" : "/login");
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
