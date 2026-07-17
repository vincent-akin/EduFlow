"use client";

import Link from "next/link";
import { BookOpen, Users, ClipboardCheck, Award, Sparkles } from "lucide-react";

import { PageHeader, Panel, StatCard } from "@/components/dashboard/widgets";
import { TrendLineChart } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { classOverview, performanceTrend, todoList } from "@/lib/mock/data";

const stats = [
  { label: "My Classes", value: "4", icon: BookOpen },
  { label: "Total Students", value: "156", icon: Users },
  { label: "Pending Grading", value: "28", icon: ClipboardCheck },
  { label: "Pending Results", value: "23", icon: Award },
];

export default function TeacherDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? "Teacher"}!`}
        subtitle="Keep up the great work."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Class Overview" className="lg:col-span-2" action={{ label: "View all classes", href: "/dashboard/classes" }}>
          <ul className="divide-y divide-border">
            {classOverview.map((cls) => (
              <li key={cls.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.students} students</p>
                </div>
                <span className="font-semibold text-foreground">{cls.avg}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="To Do List" action={{ label: "View all tasks", href: "/dashboard/assessments" }}>
          <ul className="space-y-3">
            {todoList.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-3.5 w-3.5 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
                />
                <div>
                  <p className="text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
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
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                AI Assistant
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Need help creating questions or a lesson plan?
              </p>
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/ai-chat">Ask AI</Link>
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
