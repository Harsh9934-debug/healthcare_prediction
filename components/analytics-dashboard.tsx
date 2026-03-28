"use client";

import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar
} from "recharts";
import { TrendingUp, TrendingDown, Activity, Clock, Heart, Brain, Zap, Dumbbell, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

function StatCard({ label, value, sub, trend, color }: {
  label: string; value: string | number; sub?: string; trend?: "up" | "down" | "flat"; color?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</p>
      <p className={`text-3xl font-black mt-1 ${color ?? "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      {trend && (
        <span className={`inline-flex items-center gap-1 text-xs mt-1 font-medium ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
          {trend === "up" ? "Improving" : trend === "down" ? "Worsening" : "Stable"}
        </span>
      )}
    </div>
  );
}

const SYSTEM_META = [
  { key: "cardiovascular", label: "Cardiovascular", icon: Heart, color: "#f43f5e", stroke: "#f43f5e" },
  { key: "metabolic",      label: "Metabolic",      icon: Zap,   color: "#f59e0b", stroke: "#f59e0b" },
  { key: "neurological",   label: "Neurological",   icon: Brain, color: "#a855f7", stroke: "#a855f7" },
  { key: "musculoskeletal",label: "Musculo.",        icon: Dumbbell, color: "#3b82f6", stroke: "#3b82f6" },
  { key: "immune",         label: "Immune",          icon: Shield, color: "#10b981", stroke: "#10b981" },
];

export function AnalyticsDashboard({ predictions }: { predictions: any[] }) {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 bg-background/50 p-16 text-center text-muted-foreground">
        <Activity className="mx-auto h-8 w-8 mb-3 opacity-20" />
        <p>No predictions yet. Run your first AI analysis on the dashboard!</p>
      </div>
    );
  }

  // Parse body systems
  const enriched = predictions.map(p => {
    let sys: Record<string, number> = {};
    try { sys = p.bodySystems ? JSON.parse(p.bodySystems) : {}; } catch {}
    const date = new Date(p.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });
    return { ...p, ...sys, date };
  });

  const latest = enriched[enriched.length - 1];
  const first = enriched[0];
  const ageTrend = latest.biologicalAge < first.biologicalAge ? "up" : latest.biologicalAge > first.biologicalAge ? "down" : "flat";
  const scoreTrend = (latest.healthScore ?? 0) > (first.healthScore ?? 0) ? "up" : "down";

  // Risk distribution
  const riskCounts = { Low: 0, Medium: 0, High: 0 };
  enriched.forEach(p => { if (p.riskLevel in riskCounts) riskCounts[p.riskLevel as keyof typeof riskCounts]++; });
  const riskData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Analyses" value={enriched.length} sub="predictions to date" color="text-primary" />
        <StatCard label="Latest Bio Age" value={`${latest.biologicalAge}y`} sub={`Chronological: ${JSON.parse(latest.inputDataJson || "{}").age ?? "?"}y`} trend={ageTrend} color="text-blue-500" />
        <StatCard label="Latest Health Score" value={latest.healthScore != null ? `${Math.round(latest.healthScore)}/100` : "N/A"} trend={scoreTrend} color="text-emerald-500" />
        <StatCard label="Current Risk" value={latest.riskLevel}
          color={latest.riskLevel === "High" ? "text-rose-500" : latest.riskLevel === "Medium" ? "text-amber-500" : "text-emerald-500"} />
      </div>

      {/* Bio Age & Health Score over time */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-base">Biological Age Over Time</CardTitle>
            <CardDescription>Lower is better — track progress across all sessions</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enriched} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={["auto", "auto"]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="biologicalAge" stroke="#3b82f6" fill="url(#ageGrad)" strokeWidth={2.5} dot={{ r: 3 }} name="Bio Age" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-base">Health Score Over Time</CardTitle>
            <CardDescription>Higher is better — composite wellness index</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enriched} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="healthScore" stroke="#10b981" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ r: 3 }} name="Health Score" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Body Systems Trend */}
      {enriched.some(p => p.cardiovascular != null) && (
        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-base">Body Systems Over Time</CardTitle>
            <CardDescription>Track each system's health score (higher = healthier)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enriched} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                {SYSTEM_META.map(({ key, label, stroke }) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={stroke} strokeWidth={2} dot={{ r: 2.5 }} name={label} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Risk Level Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-base">Risk Level Distribution</CardTitle>
            <CardDescription>Breakdown of all {enriched.length} predictions</CardDescription>
          </CardHeader>
          <CardContent className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}
                  fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-base">Recent Predictions</CardTitle>
            <CardDescription>Latest 5 analysis sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enriched.slice(-5).reverse().map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border/40 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-semibold">{p.date}</p>
                    <p className="text-xs text-muted-foreground">Bio Age: {p.biologicalAge}y</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.healthScore != null && (
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{Math.round(p.healthScore)}</span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.riskLevel === "High" ? "bg-rose-500/10 text-rose-500" :
                      p.riskLevel === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-emerald-500/10 text-emerald-500"
                    }`}>{p.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
