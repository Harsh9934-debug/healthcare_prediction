/**
 * AI Service — deterministic LLM-style recommendations without an external API.
 * Generates rich, contextual, actionable health advice based on user inputs.
 */

export interface HealthInput {
  age: number;
  sleep: number;
  steps: number;
  heartRate?: number;
}

export interface RecommendationContext {
  biologicalAge: number;
  ageDelta: number;
  riskLevel: "Low" | "Medium" | "High";
  sleepDeficit: boolean;
  activityDeficit: boolean;
  heartRateHigh: boolean;
}


export function generateRecommendation(input: HealthInput, ctx: RecommendationContext): string {
  const lines: string[] = [];

  // --- Header ---
  const greeting =
    ctx.riskLevel === "High"
      ? "Your current lifestyle patterns show meaningful health risks that require attention."
      : ctx.riskLevel === "Medium"
      ? "Your health profile shows moderate risk factors — small changes can have a big impact."
      : "You're on a good track! Here's how to maintain and optimise your longevity.";

  lines.push(greeting);

  // --- Sleep advice ---
  if (ctx.sleepDeficit) {
    const sleepGap = 7 - input.sleep;
    lines.push(
      `**Sleep**: You're averaging ${input.sleep}h/night — ${sleepGap.toFixed(1)}h below the recommended 7–8h. ` +
        `Poor sleep accelerates cellular aging, disrupts cortisol regulation, and raises cardiovascular risk. ` +
        `Try a fixed sleep schedule: same bedtime and wake time 7 days a week. Avoid screens 60 min before bed.`
    );
  } else {
    lines.push(
      `**Sleep**: Great — ${input.sleep}h/night is within the optimal range. Protect this habit by limiting caffeine after 2 PM and keeping your bedroom cool (≈ 18–19°C).`
    );
  }

  // --- Activity advice ---
  if (ctx.activityDeficit) {
    const stepGap = 8000 - input.steps;
    lines.push(
      `**Activity**: ${input.steps.toLocaleString()} steps/day is below the 8,000-step longevity threshold. ` +
        `Each additional 1,000 steps reduces all-cause mortality risk by ~6%. ` +
        `Add a 20-min brisk walk after lunch — this alone can close ${Math.round(stepGap / 100) * 100} of your ${stepGap.toLocaleString()}-step gap.`
    );
  } else {
    lines.push(
      `**Activity**: Excellent — ${input.steps.toLocaleString()} steps/day puts you in the top performance tier. Consider adding 2 sessions of resistance training per week to further reduce metabolic risk.`
    );
  }

  // --- Heart rate advice ---
  if (input.heartRate != null) {
    if (ctx.heartRateHigh) {
      lines.push(
        `**Heart Rate**: Resting HR of ${input.heartRate} bpm is elevated (optimal: 60–80). ` +
          `High resting HR is a strong predictor of cardiovascular events. ` +
          `Incorporate zone-2 cardio (walking, cycling) 3×/week to reduce resting HR by 5–10 bpm within 8 weeks.`
      );
    } else {
      lines.push(
        `**Heart Rate**: Resting HR of ${input.heartRate} bpm is within the healthy range. ` +
          `Monitor trends monthly — consistent readings below 70 bpm are associated with longevity.`
      );
    }
  }

  // --- Biological age delta ---
  if (ctx.ageDelta > 0) {
    lines.push(
      `**Biological Age**: Your lifestyle is ageing you ~${ctx.ageDelta} year(s) faster than your chronological age. ` +
        `The good news: biological age is highly modifiable. Consistent sleep improvement and regular activity can reverse this gap in 3–6 months.`
    );
  } else {
    lines.push(
      `**Biological Age**: Your habits are performing at or below your chronological age — you're biologically younger than your birth certificate says!`
    );
  }

  // --- Evidence-based extras ---
  const extras = [
    "Hydration: Aim for 2–3 L of water daily. Even mild dehydration (1–2%) impairs cognitive performance and cardiovascular efficiency.",
    "Nutrition: A Mediterranean-style diet (olive oil, legumes, colourful vegetables, fish) is the most evidence-backed dietary pattern for longevity.",
    "Stress: Practice 5–10 min of diaphragmatic breathing or mindfulness daily. Chronic stress elevates cortisol and accelerates telomere shortening.",
  ];

  lines.push(...extras.slice(0, ctx.riskLevel === "High" ? 3 : 2));

  return lines.join("\n\n");
}
