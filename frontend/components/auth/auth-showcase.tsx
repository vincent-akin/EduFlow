import {
  BookOpen,
  ClipboardCheck,
  BarChart3,
  LineChart,
  Sparkles,
} from "lucide-react";

import { Logo } from "@/components/logo";

const pipeline = [
  {
    icon: BookOpen,
    title: "Question bank",
    description: "Teachers build curriculum-aligned questions once, reuse them everywhere.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments",
    description: "Assemble a CBT or a printable paper from the same question pool.",
  },
  {
    icon: BarChart3,
    title: "Results",
    description: "Scores are computed, graded, and published back to students.",
  },
  {
    icon: LineChart,
    title: "Analytics",
    description: "Class, subject, and question-level performance, surfaced automatically.",
  },
  {
    icon: Sparkles,
    title: "AI insights",
    description: "Patterns and recommendations a teacher can review and act on.",
  },
];

const stats = [
  { value: "1,200+", label: "Schools" },
  { value: "50,000+", label: "Teachers" },
  { value: "450,000+", label: "Students" },
];

export function AuthShowcase() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-[hsl(var(--sidebar-background))] px-12 py-10 text-[hsl(var(--sidebar-foreground))] lg:flex">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">
        <Logo className="[&_span:last-child]:text-[hsl(var(--sidebar-foreground))]" />

        <h1 className="mt-14 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-[hsl(var(--sidebar-foreground))]">
          From first question to final insight.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[hsl(var(--sidebar-foreground))]/70">
          EduFlow carries an assessment through every stage of its life, so
          nothing is re-typed, re-graded, or re-explained by hand.
        </p>
      </div>

      <ol className="relative z-10 mt-12 space-y-0">
        {pipeline.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === pipeline.length - 1;
          return (
            <li
              key={step.title}
              className="animate-fade-in relative flex gap-4 pb-8 last:pb-0"
              style={{ animationDelay: `${index * 90}ms`, animationFillMode: "backwards" }}
            >
              {!isLast && (
                <span
                  className="absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-px bg-[hsl(var(--sidebar-foreground))]/15"
                  aria-hidden
                />
              )}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--sidebar-active))]/30 bg-[hsl(var(--sidebar-active))]/10 text-[hsl(var(--sidebar-active))]">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="pt-1.5">
                <p className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
                  {step.title}
                </p>
                <p className="mt-0.5 max-w-xs text-xs leading-relaxed text-[hsl(var(--sidebar-foreground))]/60">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="relative z-10 flex items-center gap-6 border-t border-[hsl(var(--sidebar-foreground))]/10 pt-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-lg font-bold text-[hsl(var(--sidebar-foreground))]">
              {stat.value}
            </p>
            <p className="text-xs text-[hsl(var(--sidebar-foreground))]/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
