import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { Users as IconComp } from "lucide-react";

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage teachers, students, and staff accounts." />
      <ComingSoon title="User Management" description="Manage teachers, students, and staff accounts." icon={IconComp} />
    </div>
  );
}
