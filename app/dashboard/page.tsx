import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/common";
import { HealthInsights } from "@/components/health-insights";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  // Keep authentication if required by AppShell, as requested
  await requireUser();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHeader
          title="AI Longevity Dashboard"
          description="A clean, simple view of your biological age, projected risks, AI simulations, and personalised recommendations."
        />
        <HealthInsights />
      </div>
    </AppShell>
  );
}