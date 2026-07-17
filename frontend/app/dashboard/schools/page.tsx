import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { School as IconComp } from "lucide-react";

export default function SchoolsPage() {
  return (
    <div>
      <PageHeader title="School Management" subtitle="Onboard and manage schools on the platform." />
      <ComingSoon title="School Management" description="Onboard and manage schools on the platform." icon={IconComp} />
    </div>
  );
}
