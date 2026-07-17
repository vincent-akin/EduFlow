import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { Baby as IconComp } from "lucide-react";

export default function ChildrenPage() {
  return (
    <div>
      <PageHeader title="My Children" subtitle="View detailed profiles for each of your children." />
      <ComingSoon title="My Children" description="View detailed profiles for each of your children." icon={IconComp} />
    </div>
  );
}
