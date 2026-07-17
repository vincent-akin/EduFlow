import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { BookOpen as IconComp } from "lucide-react";

export default function ClassesPage() {
  return (
    <div>
      <PageHeader title="Classes" subtitle="Manage classes, sections, and student assignments." />
      <ComingSoon title="Classes" description="Manage classes, sections, and student assignments." icon={IconComp} />
    </div>
  );
}
