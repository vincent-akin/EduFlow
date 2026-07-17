import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "destructive" | "success";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "destructive", children, ...props }, ref) => {
    const isDestructive = variant === "destructive";
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
          isDestructive
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : "border-success/30 bg-success/10 text-success",
          className
        )}
        {...props}
      >
        {isDestructive ? (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        <div>{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };
