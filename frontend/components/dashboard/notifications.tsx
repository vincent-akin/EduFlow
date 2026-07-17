"use client";

import * as React from "react";
import { Bell, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { notifications as initialNotifications } from "@/lib/mock/data";

export function NotificationsMenu() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(initialNotifications);
  const ref = React.useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => n.unread).length;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        )}
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-popover shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-popover-foreground">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((item) =>
                        item.id === n.id ? { ...item, unread: false } : item
                      )
                    )
                  }
                  className={cn(
                    "flex w-full items-start gap-2.5 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-accent",
                    n.unread && "bg-primary/5"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.unread ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  <span>
                    <span className="block text-sm font-medium text-popover-foreground">
                      {n.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {n.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {n.time}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
