import Link from "next/link";
import { ArrowRight, Brain, BarChart3, Target, Shield, Sparkles, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui";

const features = [
  {
    icon: Brain,
    title: "Biological Age Engine",
    description: "12-variable AI model calculates your true biological age based on sleep, lifestyle, vitals, and habits.",
    color: "text-violet-500", bg: "bg-violet-500/10",
  },
  {
    icon: BarChart3,
    title: "Body Systems Analytics",
    description: "Track cardiovascular, metabolic, neurological, musculoskeletal, and immune health scores independently.",
    color: "text-blue-500", bg: "bg-blue-500/10",
  },
  {
    icon: Target,
    title: "Longevity Goals",
    description: "Define and track long-term health goals. Progress tracking with smart presets for common longevity targets.",
    color: "text-emerald-500", bg: "bg-emerald-500/10",
  },
  {
    icon: Heart,
    title: "2040 Future Simulation",
    description: "Vivid AI projection of your health in 2040 under current habits — and the inspiring alternative.",
    color: "text-rose-500", bg: "bg-rose-500/10",
  },
  {
    icon: Zap,
    title: "Habit Lever Identification",
    description: "The one habit that will have the largest measurable impact on your 10-year cardiometabolic risk.",
    color: "text-amber-500", bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Longitudinal Tracking",
    description: "Every prediction is logged. View trends across time, see if your biological age is improving.",
    color: "text-cyan-500", bg: "bg-cyan-500/10",
  },
];

const stats = [
  { value: "12+", label: "Health Variables Tracked" },
  { value: "5", label: "Body Systems Scored" },
  { value: "2040", label: "Future Projection" },
  { value: "AI", label: "Powered by Gemini" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <div className="mx-auto max-w-7xl px-6 py-5">
        <header className="flex items-center justify-between rounded-3xl border bg-white/70 dark:bg-card/70 px-5 py-3.5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 rounded-xl object-cover shadow-sm bg-white" />
            <div>
              <p className="text-base font-semibold tracking-tight">GoodAI</p>
              <p className="text-[11px] text-muted-foreground leading-none">Longevity Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" className="rounded-2xl px-5 h-9 text-sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-2xl px-5 h-9 text-sm">Get Started</Button>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini AI · Biological Age Science
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-tight">
            Know your true<br />
            <span className="text-primary">biological age.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            GoodAI analyses 12+ health variables to estimate your biological age, score your body systems, project your 2040 future, and give you the one habit that changes everything.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link href="/signup">
              <Button size="lg" className="rounded-2xl px-7 gap-2">
                Start Free Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-2xl px-7">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border border-border/50 bg-background/60 p-4 text-center">
              <p className="text-3xl font-black text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Everything you need to live longer.</h2>
          <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">A complete longevity platform built on AI, science, and personalisation.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-[24px] border border-border/50 bg-card/70 p-6 hover:border-primary/30 hover:shadow-md transition-all backdrop-blur">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${f.bg} mb-4`}>
                  <Icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[28px] border border-primary/20 bg-primary/5 p-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Ready to discover your biological age?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Create your free account and get your first complete AI longevity analysis in under 2 minutes.</p>
          <Link href="/signup">
            <Button size="lg" className="rounded-2xl px-8 gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}