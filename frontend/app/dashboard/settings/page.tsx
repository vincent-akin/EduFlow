import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { Settings as IconComp } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure school branding, academic sessions, and platform preferences." />
      <ComingSoon title="Settings" description="Configure school branding, academic sessions, and platform preferences." icon={IconComp} />
    </div>
  );
}
