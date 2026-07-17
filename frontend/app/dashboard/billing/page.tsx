import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/widgets";
import { Wallet as IconComp } from "lucide-react";

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing & Subscription" subtitle="Manage your plan, usage, and payment history." />
      <ComingSoon title="Billing & Subscription" description="Manage your plan, usage, and payment history." icon={IconComp} />
    </div>
  );
}
