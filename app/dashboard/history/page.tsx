import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { Clock, CalendarDays } from "lucide-react";

export const metadata = {
  title: "History | AI Longevity Lab",
  description: "Chronological log of all your AI health predictions.",
};

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const logs = await db.aiPrediction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Insight History</h1>
          <p className="text-muted-foreground">Chronological log of your health marker checkpoints.</p>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 bg-background/50 p-12 text-center text-muted-foreground">
            <Clock className="mx-auto h-8 w-8 mb-3 opacity-20" />
            <p>No historical insights yet. Run a prediction on the dashboard!</p>
          </div>
        ) : (
          <div className="grid gap-6 w-full xl:w-[95%]">
            {logs.map((log) => {
              const date = new Date(log.createdAt).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric",
                hour: "numeric", minute: "2-digit",
              });
              return (
                <Card key={log.id} className="rounded-[24px] border-border/60 shadow-sm overflow-hidden transition-all hover:border-border/80">
                  <CardHeader className="bg-muted/10 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-muted-foreground">
                      <CalendarDays className="h-4 w-4" /> {date}
                    </span>
                    <div className="flex items-center gap-2">
                      {log.healthScore != null && (
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                          Score: {Math.round(log.healthScore)}
                        </span>
                      )}
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        log.riskLevel === "High"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : log.riskLevel === "Medium"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}>
                        {log.riskLevel} RISK
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid gap-6 md:grid-cols-[140px_1fr]">
                    <div className="space-y-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0 md:pr-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Biological Age</p>
                      <p className="text-5xl font-black tracking-tighter text-foreground flex flex-col pt-1">
                        {log.biologicalAge}
                        <span className="text-xs font-semibold tracking-normal text-muted-foreground mt-1">YEARS</span>
                      </p>
                    </div>
                    <div className="space-y-4 flex flex-col justify-center">
                      {log.futurePrediction && (
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1.5">Future Prognosis</p>
                          <p className="text-sm font-medium text-foreground/90 leading-relaxed line-clamp-3">
                            {log.futurePrediction}
                          </p>
                        </div>
                      )}
                      {log.habitLever && (
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5">Top Habit</p>
                          <p className="text-xs font-medium">{log.habitLever}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
