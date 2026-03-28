import { NextRequest, NextResponse } from "next/server";
import { runPrediction } from "@/lib/services/prediction.service";
import { runSimulation } from "@/lib/services/simulation.service";
import { generateRecommendation } from "@/lib/services/ai.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age, sleep, steps, heartRate } = body;

    // --- Input validation ---
    if (
      typeof age !== "number" || age < 1 || age > 120 ||
      typeof sleep !== "number" || sleep < 0 || sleep > 24 ||
      typeof steps !== "number" || steps < 0
    ) {
      return NextResponse.json(
        { error: "Invalid input. age (1–120), sleep (0–24), steps (≥0) are required numbers." },
        { status: 400 }
      );
    }

    const input = {
      age,
      sleep,
      steps,
      heartRate: typeof heartRate === "number" ? heartRate : undefined,
    };

    // --- Run prediction pipeline ---
    const prediction = runPrediction(input);
    const simulation = runSimulation(input, prediction.riskScore);
    const recommendations = generateRecommendation(input, {
      biologicalAge: prediction.biologicalAge,
      ageDelta: prediction.ageDelta,
      riskLevel: prediction.riskLevel,
      sleepDeficit: sleep < 7,
      activityDeficit: steps < 8000,
      heartRateHigh: (heartRate ?? 0) > 80,
    });

    const response = {
      biologicalAge: prediction.biologicalAge,
      ageDelta: prediction.ageDelta,
      riskLevel: prediction.riskLevel,
      riskScore: prediction.riskScore,
      futurePrediction: prediction.futurePrediction,
      simulation: simulation.summary,
      simulationScenarios: simulation.scenarios,
      recommendations,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[analyze-health]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
