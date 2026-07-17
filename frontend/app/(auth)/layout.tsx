import { AuthShowcase } from "@/components/auth/auth-showcase";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthShowcase />
      <div className="relative flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 lg:py-10">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
