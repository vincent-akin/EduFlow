"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsMenu } from "@/components/dashboard/notifications";
import { roleLabel, type Role } from "@/lib/nav-config";
import { useAuthStore } from "@/lib/store/auth-store";

export function Topbar({
  role,
  onMenuClick,
}: {
  role: Role;
  onMenuClick: () => void;
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search students, assessments, classes..."
          className="h-10 w-full rounded-lg border border-input bg-secondary/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <NotificationsMenu />
        <ThemeToggle />
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3 hover:bg-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold leading-tight text-foreground">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </span>
            <span className="block text-[11px] leading-tight text-muted-foreground">
              {roleLabel[role]}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
