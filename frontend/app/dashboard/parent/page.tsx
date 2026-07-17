"use client";

import { PageHeader, Panel } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { academicOverview, children } from "@/lib/mock/data";

const schoolUpdates = [
  { id: "1", title: "PTA Meeting", date: "May 28, 2026" },
  { id: "2", title: "Term 2 Break", date: "June 2 – June 3, 2026" },
  { id: "3", title: "Sports Day", date: "May 30, 2026 · 2:00 PM" },
];

export default function ParentDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.lastName ?? "Parent"}!`}
        subtitle="Here's how your children are doing."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="My Children" className="lg:col-span-2" action={{ label: "View all", href: "/dashboard/children" }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {children.map((child) => (
              <div key={child.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {child.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{child.className}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Average score</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {child.average}
                </p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  View progress
                </Button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="School Updates">
          <ul className="space-y-4">
            {schoolUpdates.map((update) => (
              <li key={update.id} className="text-sm">
                <p className="font-medium text-foreground">{update.title}</p>
                <p className="text-xs text-muted-foreground">{update.date}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Academic Overview" className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Subject</th>
                <th className="pb-2 font-medium">James</th>
                <th className="pb-2 font-medium">Mary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {academicOverview.map((row) => (
                <tr key={row.subject}>
                  <td className="py-2.5 text-foreground">{row.subject}</td>
                  <td className="py-2.5 text-muted-foreground">{row.james}</td>
                  <td className="py-2.5 text-muted-foreground">{row.mary}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" className="mt-4">
            View full report
          </Button>
        </Panel>

        <Panel title="Fees Summary">
          <p className="text-xs text-muted-foreground">Total balance</p>
          <p className="font-display text-2xl font-bold text-foreground">₦45,000</p>
          <p className="mt-1 text-xs text-muted-foreground">Due June 30, 2026</p>
          <Button className="mt-4 w-full">Make payment</Button>
        </Panel>
      </div>
    </div>
  );
}
