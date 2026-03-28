/**
 * Prediction Service — Biological Age Estimation & Risk Prediction
 *
 * Uses evidence-based heuristics to estimate biological age and
 * predict 5–10 year cardiovascular / metabolic health risk.
 */

export interface HealthInput {
  age: number;
  sleep: number;
  steps: number;
  heartRate?: number;
}

export interface PredictionResult {
  biologicalAge: number;
  ageDelta: number;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number; // 0–100
  futurePrediction: string;
}

// ---------------------------------------------------------------------------
// Biological Age Calculation
// ---------------------------------------------------------------------------
export function calculateBiologicalAge(input: HealthInput): { bio: number; delta: number } {
  let delta = 0;

  // Sleep penalties (each hour below 6 adds aging)
  if (input.sleep < 6) {
    delta += (6 - input.sleep) * 1.5; // Up to +4.5 years for 3h deficit
  } else if (input.sleep < 7) {
    delta += 0.5;
  }
  // Excellent sleep (7-9h) slightly reduces biological age
  if (input.sleep >= 7 && input.sleep <= 9) {
    delta -= 0.5;
  }

  // Activity penalties
  if (input.steps < 2000) {
    delta += 4;
  } else if (input.steps < 4000) {
    delta += 2.5;
  } else if (input.steps < 6000) {
    delta += 1;
  } else if (input.steps >= 10000) {
    delta -= 1.5; // Very active reduces biological age
  } else if (input.steps >= 8000) {
    delta -= 0.5;
  }

  // Heart rate penalty
  if (input.heartRate != null) {
    if (input.heartRate > 100) {
      delta += 3;
    } else if (input.heartRate > 85) {
      delta += 1.5;
    } else if (input.heartRate < 60) {
      delta -= 1; // Athletic HR is a longevity marker
    }
  }

  // Age context: older people are more sensitive to lifestyle deficits
  if (input.age > 50 && delta > 0) {
    delta *= 1.2;
  }

  const roundedDelta = Math.round(delta * 10) / 10;
  const biologicalAge = Math.round(input.age + roundedDelta);
  return { bio: biologicalAge, delta: roundedDelta };
}

// ---------------------------------------------------------------------------
// Risk Score Calculation
// ---------------------------------------------------------------------------
export function calculateRiskScore(input: HealthInput): number {
  let score = 0;

  // Sleep risk (0–35 points)
  if (input.sleep < 5) score += 35;
  else if (input.sleep < 6) score += 25;
  else if (input.sleep < 7) score += 15;
  else if (input.sleep <= 9) score += 0;
  else score += 5; // Oversleeping also carries risk

  // Activity risk (0–35 points)
  if (input.steps < 2000) score += 35;
  else if (input.steps < 4000) score += 25;
  else if (input.steps < 6000) score += 15;
  else if (input.steps < 8000) score += 7;
  else score += 0;

  // Heart rate risk (0–20 points)
  if (input.heartRate != null) {
    if (input.heartRate > 100) score += 20;
    else if (input.heartRate > 90) score += 12;
    else if (input.heartRate > 80) score += 6;
    else if (input.heartRate < 50) score += 3; // Bradycardia concern
    else score += 0;
  }

  // Age adjustment (max +10 additional)
  if (input.age >= 60) score += 10;
  else if (input.age >= 50) score += 6;
  else if (input.age >= 40) score += 3;

  return Math.min(100, score);
}

// ---------------------------------------------------------------------------
// Risk Level Classification
// ---------------------------------------------------------------------------
export function classifyRisk(riskScore: number): "Low" | "Medium" | "High" {
  if (riskScore >= 55) return "High";
  if (riskScore >= 30) return "Medium";
  return "Low";
}

// ---------------------------------------------------------------------------
// Future Health Prediction Narrative (5–10 year outlook)
// ---------------------------------------------------------------------------
export function generateFuturePrediction(
  input: HealthInput,
  riskLevel: "Low" | "Medium" | "High",
  biologicalAge: number,
  riskScore: number
): string {
  const decade = input.age + 10;

  if (riskLevel === "High") {
    return (
      `Based on your current patterns (${input.sleep}h sleep, ${input.steps.toLocaleString()} steps/day), ` +
      `your modelled trajectory over the next 5–10 years indicates a significantly elevated risk of ` +
      `cardiovascular events, metabolic syndrome, and accelerated cognitive decline. ` +
      `By age ${decade}, your biological clock may register as ${biologicalAge + 5}+ without intervention. ` +
      `Immediate lifestyle changes could reduce your cardiovascular risk by up to 40% within 12 months.`
    );
  }

  if (riskLevel === "Medium") {
    return (
      `Your current lifestyle presents moderate long-term health risks. ` +
      `Over the next 5–10 years, you face a ~${riskScore}% risk profile for lifestyle-related conditions ` +
      `including hypertension and early metabolic dysfunction. ` +
      `By age ${decade}, targeted improvements to sleep (target: 7–8h) and activity (target: 8,000+ steps) ` +
      `could reduce this risk by 25–35% and keep your biological age closely aligned with your real age.`
    );
  }

  return (
    `Your lifestyle patterns place you in a low-risk longevity trajectory. ` +
    `If you maintain current habits, your projected health outlook at age ${decade} is excellent — ` +
    `lower all-cause mortality risk, preserved cognitive function, and stable cardiovascular health. ` +
    `Fine-tuning sleep consistency and progressive overload in activity will compound these benefits significantly.`
  );
}

// ---------------------------------------------------------------------------
// Main Prediction Function
// ---------------------------------------------------------------------------
export function runPrediction(input: HealthInput): PredictionResult {
  const { bio, delta } = calculateBiologicalAge(input);
  const riskScore = calculateRiskScore(input);
  const riskLevel = classifyRisk(riskScore);
  const futurePrediction = generateFuturePrediction(input, riskLevel, bio, riskScore);

  return {
    biologicalAge: bio,
    ageDelta: delta,
    riskLevel,
    riskScore,
    futurePrediction,
  };
}
