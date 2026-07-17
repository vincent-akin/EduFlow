import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description ?? "This module is on the roadmap and isn't built yet."}
      </p>
    </div>
  );
}
