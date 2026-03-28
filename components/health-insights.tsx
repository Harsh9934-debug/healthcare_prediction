"use client";

import { useState } from "react";
import { Sparkles, Loader2, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export function HealthInsights() {
  const [form, setForm] = useState({
    age: "35",
    sleepHours: "6",
    stepsPerDay: "5000",
    exerciseMinutes: "30",
    stressLevel: "5",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        age: Number(form.age),
        sleepHours: Number(form.sleepHours),
        stepsPerDay: Number(form.stepsPerDay),
        exerciseMinutes: Number(form.exerciseMinutes),
        stressLevel: Number(form.stressLevel),
      };

      const res = await fetch("/api/analyze-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze health.");
      }
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "High") return "text-rose-500";
    if (level === "Medium") return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr] mt-6">
      {/* Input Side */}
      <Card className="rounded-[32px] border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
            <Activity className="h-5 w-5" />
            Health Tracker
          </CardTitle>
          <CardDescription>
            Input current daily habits to generate predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Sleep (hours)</label>
                <input
                  type="number"
                  name="sleepHours"
                  value={form.sleepHours}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Steps</label>
                <input
                  type="number"
                  name="stepsPerDay"
                  value={form.stepsPerDay}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Exercise (min)</label>
                <input
                  type="number"
                  name="exerciseMinutes"
                  value={form.exerciseMinutes}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-medium">Stress Level (0-10)</label>
                <input
                  type="number"
                  name="stressLevel"
                  min="0"
                  max="10"
                  value={form.stressLevel}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                </>
              ) : (
                "Run Prediction"
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Results Side */}
      <Card className="rounded-[32px] border-border/60 shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>
            Your personalized biological age, future risks, and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          {!results && !loading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Please run the prediction to see your personalised health insights.
            </div>
          )}
          {loading && (
            <div className="flex h-full flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Consulting</p>
            </div>
          )}
          {results && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/50 bg-background/50 p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Biological Age</p>
                  <p className="text-4xl font-bold mt-1 text-primary">{results.biologicalAge}</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/50 p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Risk Level</p>
                  <p className={`text-3xl font-bold mt-2 ${getRiskColor(results.riskLevel)}`}>
                    {results.riskLevel}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Future Prediction</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.futurePrediction}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Simulation Result</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.simulation}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                <h4 className="flex gap-2 items-center text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                  <Sparkles className="h-4 w-4" /> Recommended by AI
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {results.recommendations}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
