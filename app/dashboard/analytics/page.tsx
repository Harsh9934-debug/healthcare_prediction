import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/common";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export const metadata = {
  title: "Analytics | AI Longevity Lab",
  description: "Deep-dive into your health trends, body system scores and trajectory over time.",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const predictions = await db.aiPrediction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHeader
          title="Analytics"
          description="Track your biological age, health score, and body systems over time."
        />
        <AnalyticsDashboard predictions={predictions} />
      </div>
    </AppShell>
  );
}
