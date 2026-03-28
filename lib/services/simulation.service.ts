/**
 * Simulation Service — Habit Simulation Engine
 *
 * Projects how specific habit improvements would change health risk.
 * Implements the "What-If" simulation for the longevity dashboard.
 */

import { calculateRiskScore, classifyRisk } from "./prediction.service";

export interface HealthInput {
  age: number;
  sleep: number;
  steps: number;
  heartRate?: number;
}

export interface SimulationScenario {
  name: string;
  description: string;
  newRiskScore: number;
  newRiskLevel: "Low" | "Medium" | "High";
  riskReduction: number; // percentage points
  projectedBioAgeDelta: number; // years gained/saved
}

export interface SimulationResult {
  baselineRiskScore: number;
  scenarios: SimulationScenario[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Individual Scenario Simulations
// ---------------------------------------------------------------------------

function simulateImprovedSleep(input: HealthInput, baseScore: number): SimulationScenario {
  const improved = { ...input, sleep: Math.max(input.sleep, 7.5) };
  const newScore = calculateRiskScore(improved);
  const reduction = Math.max(0, baseScore - newScore);
  const newLevel = classifyRisk(newScore);
  const bioImprovement = input.sleep < 7 ? (7.5 - input.sleep) * 0.8 : 0;

  return {
    name: "Optimised Sleep (7.5h/night)",
    description: `Increasing your sleep to 7.5h/night activates cellular repair pathways, reduces cortisol by ~15%, and improves insulin sensitivity. This change alone can reduce cardiovascular and all-cause mortality risk.`,
    newRiskScore: newScore,
    newRiskLevel: newLevel,
    riskReduction: Math.round(reduction),
    projectedBioAgeDelta: Math.round(bioImprovement * 10) / 10,
  };
}

function simulateImprovedActivity(input: HealthInput, baseScore: number): SimulationScenario {
  const improved = { ...input, steps: Math.max(input.steps, 8000) };
  const newScore = calculateRiskScore(improved);
  const reduction = Math.max(0, baseScore - newScore);
  const newLevel = classifyRisk(newScore);
  const bioImprovement = input.steps < 8000 ? ((8000 - input.steps) / 2000) * 0.6 : 0;

  return {
    name: "Active Lifestyle (8,000+ steps)",
    description: `Reaching 8,000 steps/day reduces all-cause mortality by ~15% and cardiovascular risk by ~20% compared to sedentary behaviour. Equivalent to a 30–40 min brisk walk daily.`,
    newRiskScore: newScore,
    newRiskLevel: newLevel,
    riskReduction: Math.round(reduction),
    projectedBioAgeDelta: Math.round(bioImprovement * 10) / 10,
  };
}

function simulateCombinedImprovements(input: HealthInput, baseScore: number): SimulationScenario {
  const improved = {
    ...input,
    sleep: Math.max(input.sleep, 7.5),
    steps: Math.max(input.steps, 8000),
    heartRate: input.heartRate ? Math.min(input.heartRate, 75) : undefined,
  };
  const newScore = calculateRiskScore(improved);
  const reduction = Math.max(0, baseScore - newScore);
  const newLevel = classifyRisk(newScore);

  const bioImprovement =
    (input.sleep < 7 ? (7.5 - input.sleep) * 0.8 : 0) +
    (input.steps < 8000 ? ((8000 - input.steps) / 2000) * 0.6 : 0);

  return {
    name: "Full Lifestyle Optimisation",
    description: `Combining optimal sleep (7.5h), 8,000+ daily steps, and heart-rate management creates a compound effect. Research shows this combined intervention reduces biological age by 3–5 years within 6 months and dramatically extends healthspan.`,
    newRiskScore: newScore,
    newRiskLevel: newLevel,
    riskReduction: Math.round(reduction),
    projectedBioAgeDelta: Math.round(bioImprovement * 10) / 10,
  };
}

function simulateHighActivity(input: HealthInput, baseScore: number): SimulationScenario {
  const improved = { ...input, steps: Math.max(input.steps, 10000) };
  const newScore = calculateRiskScore(improved);
  const reduction = Math.max(0, baseScore - newScore);
  const newLevel = classifyRisk(newScore);

  return {
    name: "High Activity (10,000+ steps)",
    description: `10,000+ steps/day is the gold standard for active longevity. At this level, musculoskeletal health, metabolic rate, and mood regulation all show significant sustained improvements.`,
    newRiskScore: newScore,
    newRiskLevel: newLevel,
    riskReduction: Math.round(reduction),
    projectedBioAgeDelta: 1.5,
  };
}

// ---------------------------------------------------------------------------
// Summary Narrative Generator
// ---------------------------------------------------------------------------
function generateSummary(
  input: HealthInput,
  baseScore: number,
  bestScenario: SimulationScenario
): string {
  if (bestScenario.riskReduction === 0) {
    return `Your current habits are already well-optimised. Maintaining these patterns consistently is your most powerful longevity strategy. Monitor trends monthly and consider strength training for additional benefits.`;
  }

  const newLevel = bestScenario.newRiskLevel;
  const gainText =
    bestScenario.projectedBioAgeDelta > 0
      ? ` equivalent to recovering ~${bestScenario.projectedBioAgeDelta} biological years`
      : "";

  return (
    `If you implement all suggested changes, your risk score drops from ${Math.round(baseScore)} → ${bestScenario.newRiskScore} points${gainText}. ` +
    `Your risk category transitions from your current level to **${newLevel}**. ` +
    `The biggest lever is "${bestScenario.name}" — start there for the fastest measurable impact. ` +
    `Expect noticeable improvement in energy, sleep quality, and heart rate within 3–4 weeks of consistent change.`
  );
}

// ---------------------------------------------------------------------------
// Main Simulation Function
// ---------------------------------------------------------------------------
export function runSimulation(input: HealthInput, baseRiskScore: number): SimulationResult {
  const scenarios: SimulationScenario[] = [
    simulateImprovedSleep(input, baseRiskScore),
    simulateImprovedActivity(input, baseRiskScore),
    simulateHighActivity(input, baseRiskScore),
    simulateCombinedImprovements(input, baseRiskScore),
  ];

  // Find best scenario by risk reduction
  const bestScenario = scenarios.reduce((best, s) =>
    s.riskReduction > best.riskReduction ? s : best
  );

  const summary = generateSummary(input, baseRiskScore, bestScenario);

  return {
    baselineRiskScore: Math.round(baseRiskScore),
    scenarios,
    summary,
  };
}
