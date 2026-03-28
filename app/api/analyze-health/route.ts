// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { calculatePrediction } from "../../../services/prediction.service";
import { generateAiInsights } from "../../../services/ai.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age, sleepHours, stepsPerDay, exerciseMinutes, stressLevel } = body;

    if (
      typeof age !== "number" ||
      typeof sleepHours !== "number" ||
      typeof stepsPerDay !== "number" ||
      typeof exerciseMinutes !== "number" ||
      typeof stressLevel !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input. age, sleepHours, stepsPerDay, exerciseMinutes, stressLevel are required numbers." },
        { status: 400 }
      );
    }

    // Prediction (Mirror + Predictor)
    const predictionObj = calculatePrediction({
      age,
      sleepHours,
      stepsPerDay,
      stressLevel,
    });

    // AI logic (Time Machine + Coach)
    const aiInsights = await generateAiInsights({
      age,
      sleepHours,
      stepsPerDay,
      exerciseMinutes,
      stressLevel,
    });

    return NextResponse.json({
      biologicalAge: predictionObj.biologicalAge,
      riskLevel: predictionObj.riskLevel,
      futurePrediction: predictionObj.futurePrediction,
      simulation: aiInsights.simulation,
      recommendations: aiInsights.recommendations,
    });
  } catch (err) {
    console.error("[analyze-health api] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
