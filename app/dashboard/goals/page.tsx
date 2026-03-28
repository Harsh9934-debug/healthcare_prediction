import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/common";
import { GoalsBoard } from "@/components/goals-board";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Goals | AI Longevity Lab",
  description: "Set and track your long-term longevity and wellness goals.",
};

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHeader
          title="Longevity Goals"
          description="Define your health targets and track progress. Each goal is a commitment to your future self."
        />
        <GoalsBoard />
      </div>
    </AppShell>
  );
}
