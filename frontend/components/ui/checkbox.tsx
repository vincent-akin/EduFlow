"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <span className="relative inline-flex h-4.5 w-4.5 shrink-0">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={cn("peer absolute inset-0 h-4 w-4 cursor-pointer opacity-0", className)}
          {...props}
        />
        <span className="pointer-events-none flex h-4 w-4 items-center justify-center rounded border border-input bg-background transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
          <Check className="h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
        </span>
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
