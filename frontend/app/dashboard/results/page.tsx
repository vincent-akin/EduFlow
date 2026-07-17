"use client";

import { PageHeader, Panel, StatCard } from "@/components/dashboard/widgets";
import { TrendLineChart, SubjectBarChart } from "@/components/dashboard/charts";
import { performanceBySubject, performanceTrend, recentResults } from "@/lib/mock/data";

const stats = [
  { label: "Average Score", value: "78.4%", delta: "+4.6%" },
  { label: "Pass Rate", value: "92.6%", delta: "+4.1%" },
  { label: "Students Passed", value: "238", delta: "of 257" },
  { label: "Students Failed", value: "19", delta: "-1.2%" },
];

export default function ResultsPage() {
  return (
    <div>
      <PageHeader
        title="Results & Analytics"
        subtitle="Performance across classes, subjects, and assessments this term."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Performance Trend">
          <TrendLineChart data={performanceTrend} dataKey="score" xKey="month" />
        </Panel>
        <Panel title="Performance by Subject">
          <SubjectBarChart data={performanceBySubject} dataKey="score" xKey="subject" />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Recent Results" action={{ label: "View all", href: "/dashboard/assessments" }}>
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
    </div>
  );
}
