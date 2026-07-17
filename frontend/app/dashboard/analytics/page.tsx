import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { BarChart3 as IconComp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Deep-dive institution-wide performance analytics." />
      <ComingSoon title="Analytics" description="Deep-dive institution-wide performance analytics." icon={IconComp} />
    </div>
  );
}
