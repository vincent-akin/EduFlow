import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { FileText as IconComp } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader title="Resources" subtitle="Shared study materials and revision guides." />
      <ComingSoon title="Resources" description="Shared study materials and revision guides." icon={IconComp} />
    </div>
  );
}
