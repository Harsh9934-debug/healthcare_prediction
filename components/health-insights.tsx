"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Loader2, Activity, TrendingDown, Share2, Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#10b981" : score >= 45 ? "#f59e0b" : "#f43f5e";
  const pct = Math.min(Math.max(score, 0), 100);
  const r = 38; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(100,116,139,0.15)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform="rotate(-90 48 48)" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="48" y="52" textAnchor="middle" fill={color} fontSize="20" fontWeight="700">{Math.round(pct)}</text>
      </svg>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Health Score</p>
    </div>
  );
}

const INPUT_FIELD = "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring";

export function HealthInsights() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: "35", sleepHours: "6", stepsPerDay: "5000",
    exerciseMinutes: "30", stressLevel: "5",
    bmi: "", smokingStatus: "non-smoker", alcoholUnitsPerWeek: "4",
    dietQuality: "6", hydrationLitres: "2",
    heartRate: "", systolicBP: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/analyze-health");
      if (res.ok) { const data = await res.json(); setHistory(data); }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        age: Number(form.age), sleepHours: Number(form.sleepHours),
        stepsPerDay: Number(form.stepsPerDay), exerciseMinutes: Number(form.exerciseMinutes),
        stressLevel: Number(form.stressLevel),
        bmi: form.bmi ? Number(form.bmi) : undefined,
        smokingStatus: form.smokingStatus || undefined,
        alcoholUnitsPerWeek: form.alcoholUnitsPerWeek ? Number(form.alcoholUnitsPerWeek) : undefined,
        dietQuality: form.dietQuality ? Number(form.dietQuality) : undefined,
        hydrationLitres: form.hydrationLitres ? Number(form.hydrationLitres) : undefined,
        heartRate: form.heartRate ? Number(form.heartRate) : undefined,
        systolicBP: form.systolicBP ? Number(form.systolicBP) : undefined,
      };
      const res = await fetch("/api/analyze-health", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze health.");
      setResults(data);
      fetchHistory();
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const getRiskColor = (level: string) => {
    if (level === "High") return "text-rose-500";
    if (level === "Medium") return "text-amber-500";
    return "text-emerald-500";
  };

  const handleWhatsAppShare = () => {
    if (!results) return;
    const text = `GoodAI Longevity Report\n\nBiological Age: ${results.biologicalAge}\nHealth Score: ${results.healthScore ?? "N/A"}/100\nRisk Level: ${results.riskLevel}\n\nFocus Habit: ${results.habitLever ?? "N/A"}\nEstimated Impact: ${results.improvementImpact ?? "N/A"}\n\nMy Action Plan:\n${results.recommendations}\n\nGenerated via AI Longevity Lab`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const steps = ["Core Metrics", "Lifestyle", "Vitals (Optional)"];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1.7fr] mt-6">
      {/* Input Panel */}
      <Card className="rounded-[32px] border-border/60 shadow-sm flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
            <Activity className="h-5 w-5" /> Health Tracker
          </CardTitle>
          <CardDescription>Complete all steps for the most accurate AI analysis.</CardDescription>
          <div className="flex gap-2 pt-2">
            {steps.map((s, i) => (
              <button key={s} type="button" onClick={() => setStep(i)}
                className={`flex-1 rounded-full h-1.5 transition-all ${i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-border/50"}`}
                title={s} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{steps[step]}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <form onSubmit={handleAnalyze} className="space-y-4 h-full flex flex-col justify-between">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Age (years)", name: "age", type: "number", min: "1", max: "120" },
                  { label: "Sleep (hours/night)", name: "sleepHours", type: "number", min: "0", max: "24", step: "0.5" },
                  { label: "Daily Steps", name: "stepsPerDay", type: "number", min: "0" },
                  { label: "Exercise (min/day)", name: "exerciseMinutes", type: "number", min: "0" },
                  { label: "Stress Level (0–10)", name: "stressLevel", type: "number", min: "0", max: "10" },
                  { label: "BMI", name: "bmi", type: "number", min: "10", max: "60", step: "0.1" },
                ].map(({ label, name, ...rest }) => (
                  <div key={name} className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                    <input name={name} value={(form as any)[name]} onChange={handleChange}
                      className={INPUT_FIELD} {...rest} />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Smoking Status</label>
                  <select name="smokingStatus" value={form.smokingStatus} onChange={handleChange} className={INPUT_FIELD}>
                    <option value="non-smoker">Non-smoker</option>
                    <option value="ex-smoker">Ex-smoker</option>
                    <option value="active smoker">Active smoker</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Alcohol (units/week)</label>
                  <input name="alcoholUnitsPerWeek" type="number" min="0" max="100" value={form.alcoholUnitsPerWeek} onChange={handleChange} className={INPUT_FIELD} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diet Quality (1–10)</label>
                  <input name="dietQuality" type="number" min="1" max="10" value={form.dietQuality} onChange={handleChange} className={INPUT_FIELD} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hydration (litres/day)</label>
                  <input name="hydrationLitres" type="number" min="0" max="10" step="0.1" value={form.hydrationLitres} onChange={handleChange} className={INPUT_FIELD} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resting Heart Rate (bpm)</label>
                  <input name="heartRate" type="number" min="30" max="220" value={form.heartRate} onChange={handleChange} className={INPUT_FIELD} placeholder="e.g. 72" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Systolic BP (mmHg)</label>
                  <input name="systolicBP" type="number" min="60" max="250" value={form.systolicBP} onChange={handleChange} className={INPUT_FIELD} placeholder="e.g. 120" />
                </div>
                <div className="col-span-2 rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Vitals are optional but improve prediction precision significantly. Skip if you don't have recent readings.
                  </p>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-rose-500 rounded-xl bg-rose-500/10 px-3 py-2">{error}</p>}

            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 rounded-2xl border border-border/60 px-4 py-2.5 text-sm font-semibold transition hover:bg-muted/40">
                  Back
                </button>
              )}
              {step < 2 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Continue →
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex-1 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing</> : <><Sparkles className="mr-2 h-4 w-4" />Run AI Analysis</>}
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="rounded-[32px] border-border/60 shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" /> AI Health Insights
          </CardTitle>
          <CardDescription>Biological age, future projection & personalised action plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-y-auto">
          {!results && !loading && (
            <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
              Complete the form and run analysis to see your insights.
            </div>
          )}
          {loading && (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Consulting the Antigravity Engine…</p>
            </div>
          )}
          {results && !loading && (
            <div className="space-y-6">
              {/* Score Row */}
              <div className="flex items-center gap-6">
                {results.healthScore != null && <HealthScoreRing score={results.healthScore} />}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/50 bg-background/50 p-4 text-center">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-widest mb-1">Biological Age</p>
                    <p className="text-4xl font-black text-primary">{results.biologicalAge}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">years</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/50 p-4 text-center">
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-widest mb-1">Risk Level</p>
                    <p className={`text-3xl font-black mt-1 ${getRiskColor(results.riskLevel)}`}>{results.riskLevel}</p>
                  </div>
                </div>
              </div>

              {/* History Chart */}
              {history.length > 1 && (
                <div className="rounded-3xl border border-border/50 bg-background p-5 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-semibold tracking-tight mb-4">
                    <TrendingDown className="h-5 w-5 text-emerald-500" /> Biological Age Trajectory
                  </h4>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history.map(h => ({
                        date: new Date(h.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
                        Age: h.biologicalAge,
                      }))} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis domain={["auto", "auto"]} fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #eaeaea", fontSize: "12px" }} />
                        <Line type="stepAfter" dataKey="Age" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Habit Lever */}
              {results.habitLever && (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <h4 className="flex gap-2 items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Target className="h-4 w-4" /> #1 Habit to Change
                  </h4>
                  <p className="text-sm font-medium">{results.habitLever}</p>
                  {results.improvementImpact && (
                    <p className="text-xs text-muted-foreground mt-1">{results.improvementImpact}</p>
                  )}
                </div>
              )}

              {/* Future Prediction */}
              <div>
                <h4 className="text-sm font-semibold mb-1">Future Prognosis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{results.futurePrediction}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Simulation Result</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{results.simulation}</p>
              </div>

              {/* Recommendations */}
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                <h4 className="flex gap-2 items-center text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                  <Sparkles className="h-4 w-4" /> AI Action Plan
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{results.recommendations}</p>
              </div>

              <button onClick={handleWhatsAppShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]">
                <Share2 className="h-4 w-4" /> Share to WhatsApp
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
