import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/common";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { UserCircle2, Calendar, Activity, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata = {
  title: "Profile | AI Longevity Lab",
  description: "Your health baseline, account details, and longevity overview.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, predictionCount, latestPrediction] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, createdAt: true },
    }),
    db.aiPrediction.count({ where: { userId: session.user.id } }),
    db.aiPrediction.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  const initials = (user?.name ?? user?.email ?? "U")
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <PageHeader
          title="Profile"
          description="Your health baseline and account overview."
        />

        {/* Avatar + name */}
        <Card className="rounded-[28px]">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-black text-primary border border-primary/20">
              {initials}
            </div>
            <div>
              <p className="text-xl font-semibold">{user?.name ?? "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Member since {joinedDate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-[20px]">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-black text-primary">{predictionCount}</p>
              <p className="text-xs text-muted-foreground mt-1">AI Analyses</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px]">
            <CardContent className="p-5 text-center">
              <p className={`text-3xl font-black ${latestPrediction?.biologicalAge ? "text-blue-500" : "text-muted-foreground"}`}>
                {latestPrediction?.biologicalAge != null ? `${latestPrediction.biologicalAge}y` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Last Bio Age</p>
            </CardContent>
          </Card>
          <Card className="rounded-[20px]">
            <CardContent className="p-5 text-center">
              <p className={`text-3xl font-black ${
                latestPrediction?.riskLevel === "High" ? "text-rose-500" :
                latestPrediction?.riskLevel === "Medium" ? "text-amber-500" :
                latestPrediction?.riskLevel ? "text-emerald-500" : "text-muted-foreground"
              }`}>
                {latestPrediction?.riskLevel ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Risk Level</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest insight summary */}
        {latestPrediction && (
          <Card className="rounded-[28px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4 text-primary" /> Latest AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestPrediction.futurePrediction && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Future Prognosis</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{latestPrediction.futurePrediction}</p>
                </div>
              )}
              {latestPrediction.habitLever && (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold mb-1">Top Habit to Change</p>
                  <p className="text-sm font-medium">{latestPrediction.habitLever}</p>
                  {latestPrediction.improvementImpact && (
                    <p className="text-xs text-muted-foreground mt-0.5">{latestPrediction.improvementImpact}</p>
                  )}
                </div>
              )}
              {latestPrediction.recommendations && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Action Plan</p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{latestPrediction.recommendations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
