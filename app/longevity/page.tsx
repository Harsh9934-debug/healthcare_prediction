"use client";

import { useState } from "react";
import {
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  Dna,
  FlaskConical,
  Heart,
  Loader2,
  Moon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { PageHeader, StatusPill } from "@/components/common";
import { AppShell } from "@/components/app-shell";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------
interface SimulationScenario {
  name: string;
  description: string;
  newRiskScore: number;
  newRiskLevel: "Low" | "Medium" | "High";
  riskReduction: number;
  projectedBioAgeDelta: number;
}

interface AnalysisResult {
  biologicalAge: number;
  ageDelta: number;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  futurePrediction: string;
  simulation: string;
  simulationScenarios: SimulationScenario[];
  recommendations: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function riskColor(level: "Low" | "Medium" | "High") {
  if (level === "High") return "text-rose-500";
  if (level === "Medium") return "text-amber-500";
  return "text-emerald-500";
}

function riskBgColor(level: "Low" | "Medium" | "High") {
  if (level === "High") return "bg-rose-500/10 border-rose-500/30";
  if (level === "Medium") return "bg-amber-500/10 border-amber-500/30";
  return "bg-emerald-500/10 border-emerald-500/30";
}

function riskTone(level: "Low" | "Medium" | "High"): "danger" | "warning" | "success" {
  if (level === "High") return "danger";
  if (level === "Medium") return "warning";
  return "success";
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(100, score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const gaugeColor =
    pct >= 55 ? "#f43f5e" : pct >= 30 ? "#f59e0b" : "#10b981";

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="10"
          className="stroke-muted/30"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="10"
          stroke={gaugeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="text-center">
        <p className="text-3xl font-bold tracking-tight">{Math.round(score)}</p>
        <p className="text-xs text-muted-foreground">Risk Score</p>
      </div>
    </div>
  );
}

function ScenarioCard({ scenario, baseline }: { scenario: SimulationScenario; baseline: number }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((scenario.riskReduction / Math.max(baseline, 1)) * 100);

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${riskBgColor(scenario.newRiskLevel)}`}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{scenario.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold ${riskColor(scenario.newRiskLevel)}`}>
              {scenario.newRiskLevel} risk
            </span>
            {scenario.riskReduction > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingDown className="h-3 w-3" />
                −{scenario.riskReduction} pts ({pct}% reduction)
              </span>
            )}
            {scenario.projectedBioAgeDelta > 0 && (
              <span className="flex items-center gap-1 text-xs text-sky-400">
                <Dna className="h-3 w-3" />
                −{scenario.projectedBioAgeDelta}y biol. age
              </span>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.description}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function LongevityPage() {
  const [form, setForm] = useState({
    age: "",
    sleep: "",
    steps: "",
    heartRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, number> = {
        age: Number(form.age),
        sleep: Number(form.sleep),
        steps: Number(form.steps),
      };
      if (form.heartRate) payload.heartRate = Number(form.heartRate);

      const res = await fetch("/api/analyze-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.age && form.sleep && form.steps &&
    Number(form.age) > 0 && Number(form.sleep) >= 0 && Number(form.steps) >= 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* --------- Header --------- */}
        <PageHeader
          title="AI Longevity Lab"
          description="Estimate your biological age, predict future health risk, simulate habit changes, and get personalised AI-powered recommendations."
          action={
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">AI for Longevity · Health</span>
            </div>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
          {/* --------- Input Form --------- */}
          <div className="space-y-4">
            <Card className="rounded-[28px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Health Input
                </CardTitle>
                <CardDescription>
                  Enter your current health metrics to run a full longevity analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="health-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="age">Chronological Age (years)</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min={1}
                      max={120}
                      placeholder="e.g. 35"
                      value={form.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sleep" className="flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5" />
                      Average Sleep (hours/night)
                    </Label>
                    <Input
                      id="sleep"
                      name="sleep"
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      placeholder="e.g. 6.5"
                      value={form.sleep}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 7–9h · Below 6h significantly accelerates ageing
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="steps" className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      Daily Steps
                    </Label>
                    <Input
                      id="steps"
                      name="steps"
                      type="number"
                      min={0}
                      placeholder="e.g. 5500"
                      value={form.steps}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Target: 8,000+ steps · Below 4,000 = sedentary risk
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="heartRate" className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5" />
                      Resting Heart Rate (bpm) — optional
                    </Label>
                    <Input
                      id="heartRate"
                      name="heartRate"
                      type="number"
                      min={30}
                      max={220}
                      placeholder="e.g. 72"
                      value={form.heartRate}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optimal: 60–80 bpm · Higher HR linked to cardiovascular risk
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analysing…
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Run Longevity Analysis
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Reference card */}
            <Card className="rounded-[28px]">
              <CardHeader>
                <CardTitle className="text-base">Reference Benchmarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {[
                  { icon: Moon, label: "Sleep", good: "7–9h", bad: "<6h" },
                  { icon: Activity, label: "Steps", good: "8,000+", bad: "<4,000" },
                  { icon: Heart, label: "Resting HR", good: "60–75 bpm", bad: ">90 bpm" },
                ].map(({ icon: Icon, label, good, bad }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-emerald-400">✓ {good}</span>
                      <span className="text-rose-400">✗ {bad}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* --------- Results Panel --------- */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[28px] border border-dashed border-border/60 bg-background/40 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-semibold">No Analysis Yet</p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Fill in your health metrics and click "Run Longevity Analysis" to see your personalised AI-powered insights.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[28px] border border-border/60 bg-background/40 p-8 text-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium">Running AI longevity analysis…</p>
                <p className="mt-1 text-xs text-muted-foreground">Calculating biological age, risk scores, and simulations</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* ---- Top KPI Row ---- */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Biological Age Card */}
                  <Card className="rounded-[28px] bg-gradient-to-br from-primary/10 via-background to-background">
                    <CardContent className="flex flex-col items-center pt-6 pb-4 text-center">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                        <Dna className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Biological Age</p>
                      <p className="mt-1 text-5xl font-bold tracking-tight">{result.biologicalAge}</p>
                      <p className="text-xs text-muted-foreground">years</p>
                      {result.ageDelta !== 0 && (
                        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${result.ageDelta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {result.ageDelta > 0 ? (
                            <><TrendingUp className="h-3 w-3" /> +{result.ageDelta}y older than real age</>
                          ) : (
                            <><TrendingDown className="h-3 w-3" /> {result.ageDelta}y younger than real age</>
                          )}
                        </div>
                      )}
                      {result.ageDelta === 0 && (
                        <p className="mt-2 text-xs text-emerald-400">= chronological age</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Risk Level Card */}
                  <Card className={`rounded-[28px] border ${riskBgColor(result.riskLevel)}`}>
                    <CardContent className="flex flex-col items-center pt-6 pb-4 text-center">
                      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-2xl ${riskBgColor(result.riskLevel)}`}>
                        <Heart className={`h-5 w-5 ${riskColor(result.riskLevel)}`} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Health Risk</p>
                      <p className={`mt-1 text-4xl font-bold tracking-tight ${riskColor(result.riskLevel)}`}>
                        {result.riskLevel}
                      </p>
                      <StatusPill tone={riskTone(result.riskLevel)} className="mt-2">
                        Score: {result.riskScore}/100
                      </StatusPill>
                    </CardContent>
                  </Card>

                  {/* Risk Gauge Card */}
                  <Card className="rounded-[28px]">
                    <CardContent className="flex flex-col items-center pt-6 pb-4 text-center">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk Gauge</p>
                      <RiskGauge score={result.riskScore} />
                    </CardContent>
                  </Card>
                </div>

                {/* ---- Future Prediction ---- */}
                <Card className="rounded-[28px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="h-4 w-4 text-sky-400" />
                      5–10 Year Health Outlook
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {result.futurePrediction}
                    </p>
                  </CardContent>
                </Card>

                {/* ---- Simulation ---- */}
                <Card className="rounded-[28px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FlaskConical className="h-4 w-4 text-violet-400" />
                      Habit Simulation Engine
                    </CardTitle>
                    <CardDescription>
                      What happens if you improve your habits? Expand each scenario to learn more.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
                      <p className="text-sm leading-6 text-muted-foreground">{result.simulation}</p>
                    </div>
                    <div className="space-y-2">
                      {result.simulationScenarios.map((s, i) => (
                        <ScenarioCard key={i} scenario={s} baseline={result.riskScore} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ---- AI Recommendations ---- */}
                <Card className="rounded-[28px] bg-gradient-to-br from-primary/5 via-background to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalised, evidence-based advice built from your metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations
                        .split("\n\n")
                        .filter(Boolean)
                        .map((block, i) => {
                          const isHeader = block.startsWith("⚠️") || block.startsWith("📊") || block.startsWith("✅");
                          return (
                            <div
                              key={i}
                              className={`rounded-2xl border border-border/50 p-4 ${isHeader ? "bg-primary/5" : "bg-background/40"}`}
                            >
                              <p
                                className={`text-sm leading-7 ${isHeader ? "font-semibold" : "text-muted-foreground"}`}
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {block.replace(/\*\*/g, "")}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      ⚕️ This is an educational tool. Always consult a qualified healthcare professional before making health decisions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
