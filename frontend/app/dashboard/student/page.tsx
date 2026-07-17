"use client";

import Link from "next/link";
import { Percent, ClipboardList, FileCheck, Award, BookOpenCheck } from "lucide-react";

import { PageHeader, Panel, StatCard } from "@/components/dashboard/widgets";
import { TrendLineChart } from "@/components/dashboard/charts";
import { useAuthStore } from "@/lib/store/auth-store";
import { performanceTrend, recentResults, upcomingAssessments } from "@/lib/mock/data";

const stats = [
  { label: "Average Score", value: "82.6%", icon: Percent },
  { label: "Assignments", value: "12", delta: "9 pending", icon: ClipboardList },
  { label: "Tests Taken", value: "24", icon: FileCheck },
  { label: "Class Rank", value: "5th", delta: "out of 42", icon: Award },
];

export default function StudentDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? "Student"}!`}
        subtitle="Keep up the great work."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Upcoming Assessments" action={{ label: "View all", href: "/dashboard/assessments" }}>
          <ul className="divide-y divide-border">
            {upcomingAssessments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                  <p className="text-xs font-medium text-warning">{a.due}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Results" action={{ label: "View all results", href: "/dashboard/results" }}>
          <ul className="divide-y divide-border">
            {recentResults.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-foreground">{r.title}</span>
                <span className="font-semibold text-success">{r.score}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Performance Trend" className="lg:col-span-2">
          <TrendLineChart data={performanceTrend} dataKey="score" xKey="month" />
        </Panel>

        <Panel>
          <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpenCheck className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-foreground">
            Keep learning!
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re doing great. Consistent effort is paying off.
          </p>
          <Link
            href="/dashboard/assessments"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            View my tasks →
          </Link>
        </Panel>
      </div>
    </div>
  );
}
