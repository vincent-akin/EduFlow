import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { Newspaper as IconComp } from "lucide-react";

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="School News" subtitle="Announcements and updates from the school." />
      <ComingSoon title="School News" description="Announcements and updates from the school." icon={IconComp} />
    </div>
  );
}
