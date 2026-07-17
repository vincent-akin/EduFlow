"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Plus,
  ClipboardCheck,
  UserPlus,
  BookOpen,
} from "lucide-react";

import { PageHeader, Panel, StatCard } from "@/components/dashboard/widgets";
import { TrendLineChart, DonutChart, DonutLegend } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import { CreateAssessmentDialog } from "@/components/dashboard/create-assessment-dialog";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAdminDashboard } from "@/lib/api/use-dashboard";
import { usePerformanceTrend, useAssessmentTypeDistribution } from "@/lib/api/use-analytics";

// Keep mock data for recent activities and top performing classes
import {
  recentActivities,
  topPerformingClasses,
} from "@/lib/mock/data";

// Color mapping for assessment types with light backgrounds and deep foregrounds
const assessmentTypeColors: Record<string, { color: string; bgColor: string }> = {
  'Quiz': { 
    color: '#7C3AED', // Deep purple
    bgColor: '#EDE9FE' // Light purple
  },
  'Test': { 
    color: '#2563EB', // Deep blue
    bgColor: '#DBEAFE' // Light blue
  },
  'Assignment': { 
    color: '#059669', // Deep green
    bgColor: '#D1FAE5' // Light green
  },
  'Exam': { 
    color: '#D97706', // Deep amber
    bgColor: '#FEF3C7' // Light amber
  },
};

const defaultTypes = [
  { name: 'Quiz', value: 0, color: '#7C3AED', bgColor: '#EDE9FE' },
  { name: 'Test', value: 0, color: '#2563EB', bgColor: '#DBEAFE' },
  { name: 'Assignment', value: 0, color: '#059669', bgColor: '#D1FAE5' },
  { name: 'Exam', value: 0, color: '#D97706', bgColor: '#FEF3C7' },
];

// Create Menu component (keep the same)
function CreateMenu({ onNewAssessment }: { onNewAssessment: () => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button size="sm" onClick={() => setOpen((v) => !v)}>
        <Plus className="h-4 w-4" />
        Create New
      </Button>
      {open && (
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onNewAssessment();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
          >
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            New assessment
          </button>
          <Link
            href="/dashboard/users"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
          >
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            New user
          </Link>
          <Link
            href="/dashboard/classes"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            New class
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useAdminDashboard();
  const { data: trendData, isLoading: trendLoading } = usePerformanceTrend(12);
  const { data: typeDistribution, isLoading: typeLoading } = useAssessmentTypeDistribution();
  
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [createdCount, setCreatedCount] = React.useState(0);

  // Loading state
  if (dashboardLoading || trendLoading || typeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    console.error('Dashboard error:', dashboardError);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">
            {dashboardError instanceof Error ? dashboardError.message : 'Unknown error'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Use real data if available
  const stats = dashboardData?.stats ? [
    { 
      label: "Total Students", 
      value: dashboardData.stats.totalStudents.toLocaleString(), 
      delta: "from last month" 
    },
    { 
      label: "Total Teachers", 
      value: dashboardData.stats.totalTeachers.toLocaleString(), 
      delta: "from last month" 
    },
    { 
      label: "Total Assessments", 
      value: dashboardData.stats.totalAssessments.toLocaleString(), 
      delta: "from last month" 
    },
    { 
      label: "Avg. Performance", 
      value: `${dashboardData.stats.averageScore.toFixed(1)}%`, 
      delta: "from last month" 
    },
  ] : [
    { label: "Total Students", value: "0", delta: "Loading..." },
    { label: "Total Teachers", value: "0", delta: "Loading..." },
    { label: "Total Assessments", value: "0", delta: "Loading..." },
    { label: "Avg. Performance", value: "0%", delta: "Loading..." },
  ];

  const icons = [Users, GraduationCap, ClipboardList, TrendingUp];

  // Use real trend data if available
  const chartData = trendData && trendData.length > 0 
    ? trendData 
    : [
        { month: 'Jan', score: 0 },
        { month: 'Feb', score: 0 },
        { month: 'Mar', score: 0 },
        { month: 'Apr', score: 0 },
        { month: 'May', score: 0 },
        { month: 'Jun', score: 0 },
      ];

  // Use real assessment type data with colors
  const assessmentTypes = typeDistribution && typeDistribution.length > 0
    ? typeDistribution.map((item: any) => {
        const colors = assessmentTypeColors[item.name] || assessmentTypeColors[item.name?.toLowerCase()] || { 
          color: '#6B7280', 
          bgColor: '#F3F4F6' 
        };
        return {
          ...item,
          color: colors.color,
          bgColor: colors.bgColor,
        };
      })
    : defaultTypes;

  const totalAssessments = assessmentTypes.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? "Admin"}!`}
        subtitle="Here's what's happening at your school today."
        action={<CreateMenu onNewAssessment={() => setDialogOpen(true)} />}
      />

      {createdCount > 0 && (
        <div className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">
          {createdCount} assessment{createdCount > 1 ? "s" : ""} created as draft —
          view it on the{" "}
          <Link href="/dashboard/assessments" className="font-medium underline">
            Assessments page
          </Link>
          .
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} icon={icons[i]} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Performance Overview" className="lg:col-span-2">
          <TrendLineChart data={chartData as any} dataKey="score" xKey="month" />
        </Panel>
        <Panel title="Assessments by Type">
          <DonutChart data={assessmentTypes} total={totalAssessments} />
          <DonutLegend data={assessmentTypes} />
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Recent Activities">
          <ul className="space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-foreground">{activity.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top Performing Classes" action={{ label: "View all", href: "/dashboard/analytics" }}>
          <ul className="space-y-3">
            {topPerformingClasses.map((cls) => (
              <li key={cls.rank} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {cls.rank}
                </span>
                <span className="flex-1 text-foreground">{cls.name}</span>
                <span className="font-semibold text-success">{cls.score}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <CreateAssessmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => setCreatedCount((c) => c + 1)}
      />
    </div>
  );
}