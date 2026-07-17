import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { History as IconComp } from "lucide-react";

export default function AttendancePage() {
  return (
    <div>
      <PageHeader title="Attendance" subtitle="Review daily and termly attendance records." />
      <ComingSoon title="Attendance" description="Review daily and termly attendance records." icon={IconComp} />
    </div>
  );
}
