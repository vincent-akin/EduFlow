"use client";

import * as React from "react";
import { Search, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/widgets";
import { messageThreads } from "@/lib/mock/data";

export default function MessagesPage() {
  const [activeId, setActiveId] = React.useState(messageThreads[0].id);
  const [draft, setDraft] = React.useState("");
  const active = messageThreads.find((t) => t.id === activeId)!;

  return (
    <div>
      <PageHeader title="Messages" subtitle="Conversations with teachers, admin, and parents." />

      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[280px_1fr]">
        <div className="border-b border-border md:border-b-0 md:border-r">
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search messages..."
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <ul className="max-h-[520px] overflow-y-auto">
            {messageThreads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => setActiveId(thread.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent",
                    activeId === thread.id && "bg-accent"
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {thread.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium text-foreground">
                        {thread.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {thread.time}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {thread.preview}
                    </span>
                  </span>
                  {thread.unread && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex h-[560px] flex-col">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {active.name.split(" ").map((n) => n[0]).join("")}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{active.name}</p>
              <p className="text-xs text-muted-foreground">{active.role}</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            <div className="max-w-xs rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
              {active.preview}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDraft("");
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message..."
              className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
