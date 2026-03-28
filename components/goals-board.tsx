"use client";

import { useState } from "react";
import { Plus, Trash2, Check, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

const PRESET_GOALS = [
  { title: "Sleep 8 hours/night for 30 days", category: "Sleep", target: 30, unit: "days" },
  { title: "Walk 10,000 steps daily for 2 weeks", category: "Activity", target: 14, unit: "days" },
  { title: "Reduce stress score to under 4", category: "Mental", target: 4, unit: "score" },
  { title: "Lower biological age by 2 years", category: "Longevity", target: 2, unit: "years" },
  { title: "Achieve Health Score ≥ 75", category: "Overall", target: 75, unit: "score" },
  { title: "Drink 2.5L water daily for 3 weeks", category: "Hydration", target: 21, unit: "days" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Sleep: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Activity: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Mental: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Longevity: "bg-primary/10 text-primary border-primary/20",
  Overall: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Hydration: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Custom: "bg-muted/60 text-foreground border-border/50",
};

type Goal = {
  id: number; title: string; category: string;
  progress: number; target: number; unit: string; done: boolean;
};

let idSeq = 1;

export function GoalsBoard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("30");

  const addPreset = (preset: typeof PRESET_GOALS[0]) => {
    setGoals(g => [...g, { ...preset, id: idSeq++, progress: 0, done: false }]);
  };

  const addCustom = () => {
    if (!newTitle.trim()) return;
    setGoals(g => [...g, { id: idSeq++, title: newTitle.trim(), category: "Custom", progress: 0, target: Number(newTarget) || 30, unit: "days", done: false }]);
    setNewTitle(""); setNewTarget("30");
  };

  const updateProgress = (id: number, delta: number) => {
    setGoals(g => g.map(goal => {
      if (goal.id !== id) return goal;
      const progress = Math.min(Math.max(goal.progress + delta, 0), goal.target);
      return { ...goal, progress, done: progress >= goal.target };
    }));
  };

  const removeGoal = (id: number) => setGoals(g => g.filter(x => x.id !== id));

  const done = goals.filter(g => g.done).length;
  const active = goals.filter(g => !g.done).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-center">
            <p className="text-3xl font-black text-primary">{goals.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Goals</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-center">
            <p className="text-3xl font-black text-emerald-500">{done}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-center">
            <p className="text-3xl font-black text-amber-500">{active}</p>
            <p className="text-xs text-muted-foreground mt-1">In Progress</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Active Goals */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your Goals</h2>
          {goals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 bg-background/50 p-12 text-center text-muted-foreground">
              <Target className="mx-auto h-8 w-8 mb-3 opacity-20" />
              <p>No goals yet. Add a preset or create your own below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => {
                const pct = Math.round((goal.progress / goal.target) * 100);
                return (
                  <div key={goal.id} className={`rounded-2xl border p-4 space-y-3 transition-all ${goal.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-background/60"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[goal.category] ?? CATEGORY_COLORS.Custom}`}>
                            {goal.category}
                          </span>
                          {goal.done && <Trophy className="h-3.5 w-3.5 text-emerald-500" />}
                        </div>
                        <p className="text-sm font-semibold leading-snug">{goal.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{goal.progress} / {goal.target} {goal.unit}</p>
                      </div>
                      <button onClick={() => removeGoal(goal.id)} className="text-muted-foreground hover:text-rose-500 transition-colors shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-border/40 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: goal.done ? "#10b981" : "hsl(var(--primary))" }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateProgress(goal.id, -1)}
                          className="flex-1 rounded-xl border border-border/50 text-xs py-1.5 font-semibold hover:bg-muted/40 transition-colors">
                          −1
                        </button>
                        <span className="flex items-center justify-center text-xs font-bold text-muted-foreground min-w-10">{pct}%</span>
                        <button onClick={() => updateProgress(goal.id, 1)}
                          className="flex-1 rounded-xl bg-primary/10 border border-primary/20 text-xs py-1.5 font-semibold text-primary hover:bg-primary/20 transition-colors">
                          +1
                        </button>
                        {!goal.done && (
                          <button onClick={() => updateProgress(goal.id, goal.target - goal.progress)}
                            className="flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                            <Check className="h-3 w-3" /> Done
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Custom goal creator */}
          <div className="rounded-2xl border border-dashed border-border/60 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Custom Goal</p>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Meditate for 20 min daily for 30 days"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex gap-2">
              <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} min="1"
                placeholder="Target (days)"
                className="flex h-10 w-1/3 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={addCustom}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
                <Plus className="h-4 w-4" /> Add Goal
              </button>
            </div>
          </div>
        </div>

        {/* Preset Goals */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Suggested Goals</h2>
          <div className="space-y-2">
            {PRESET_GOALS.map(preset => {
              const isAdded = goals.some(g => g.title === preset.title);
              return (
                <button key={preset.title} onClick={() => !isAdded && addPreset(preset)} disabled={isAdded}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${isAdded ? "border-emerald-500/30 bg-emerald-500/5 opacity-60 cursor-not-allowed" : "border-border/50 bg-background/60 hover:border-primary/40 hover:bg-primary/5"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[preset.category] ?? CATEGORY_COLORS.Custom}`}>
                        {preset.category}
                      </span>
                      <p className="text-sm font-medium mt-1.5 leading-snug">{preset.title}</p>
                    </div>
                    {isAdded ? <Check className="h-5 w-5 shrink-0 text-emerald-500" /> : <Plus className="h-5 w-5 shrink-0 text-muted-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
