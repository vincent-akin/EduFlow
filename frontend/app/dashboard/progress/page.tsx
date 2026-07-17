import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { BarChart3 as IconComp } from "lucide-react";

export default function ProgressPage() {
  return (
    <div>
      <PageHeader title="Academic Progress" subtitle="Track performance trends across every subject." />
      <ComingSoon title="Academic Progress" description="Track performance trends across every subject." icon={IconComp} />
    </div>
  );
}
