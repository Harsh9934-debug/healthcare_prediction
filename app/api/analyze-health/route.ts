// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { calculatePrediction } from "../../../services/prediction.service";
import { generateAiInsights } from "../../../services/ai.service";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const predictions = await db.aiPrediction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(predictions);
  } catch (err) {
    console.error("[analyze-health api GET] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const responsePayload = {
      biologicalAge: aiInsights.biologicalAge || predictionObj.biologicalAge,
      riskLevel: predictionObj.riskLevel,
      futurePrediction: aiInsights.futurePrediction || predictionObj.futurePrediction,
      simulation: aiInsights.simulation,
      recommendations: aiInsights.recommendations,
    };

    const session = await auth();
    if (session?.user?.id) {
      await db.aiPrediction.create({
        data: {
          userId: session.user.id,
          biologicalAge: responsePayload.biologicalAge,
          riskLevel: responsePayload.riskLevel,
          futurePrediction: responsePayload.futurePrediction,
          simulation: responsePayload.simulation,
          recommendations: responsePayload.recommendations,
          inputDataJson: JSON.stringify(body),
        },
      });
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("[analyze-health api] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
