export async function generateAiInsights({
  age, sleepHours, stepsPerDay, exerciseMinutes, stressLevel,
  bmi, smokingStatus, alcoholUnitsPerWeek, dietQuality, hydrationLitres,
  heartRate, systolicBP
}) {
  try {
    const prompt = `Act as the 'GoodAI Antigravity Engine' — a next-generation biological-age estimator, precision health-risk simulator, and longevity coach.

### PATIENT INPUT DATA:
- Chronological Age: ${age} years
- Sleep: ${sleepHours} hours/night
- Daily Steps: ${stepsPerDay}
- Exercise: ${exerciseMinutes} min/day
- Stress Level: ${stressLevel}/10
- BMI: ${bmi ?? "unknown"}
- Smoking: ${smokingStatus ?? "non-smoker"}
- Alcohol: ${alcoholUnitsPerWeek ?? 0} units/week
- Diet Quality (1-10): ${dietQuality ?? 5}
- Hydration: ${hydrationLitres ?? 2} litres/day
- Resting Heart Rate: ${heartRate ?? "unknown"} bpm
- Systolic Blood Pressure: ${systolicBP ?? "unknown"} mmHg

### CALCULATION LOGIC:
1. BIOLOGICAL AGE: Start at chronological age. Apply cumulative adjustments:
   - Sleep < 7h: +2.5 yrs per missing hour
   - Stress > 5: +1.5 yrs per point above 5
   - Steps < 5000: +1.5 yrs per missing 1000 steps; steps > 8000: -1 yr
   - Exercise > 30 min/day: -0.5 yrs
   - BMI: if >30 add +4, if >25 add +2, if 18.5–24.9 no change, if <18.5 add +1.5
   - Smoking: active smoker +6 yrs; ex-smoker +2 yrs
   - Alcohol >14 units/week: +3 yrs; 8–14 units: +1.5 yrs
   - Diet quality <4: +3 yrs; 4–6: +1 yr; 7–9: -0.5 yrs; 10: -1.5 yrs
   - Hydration <1.5L: +1 yr
   - Resting HR if known: >90 bpm +2, 70–90 +0, <60 -1
   - Systolic BP if known: >140 +3, 130–140 +1.5, <120 -0.5

2. HEALTH SCORE (0–100): Overall wellness composite based on all inputs.

3. 2040 DOWNSIDE: 2 vivid cautionary sentences if habits persist.

4. 2040 UPSIDE: 2 inspiring sentences after ONE habit improvement.

5. HABIT LEVER: The single highest-impact habit to change.

6. MICRO-COMMITMENTS: 3 specific, actionable daily habits with expected improvement percentage.

7. IMPROVEMENT IMPACT: Percentage reduction in 10-year cardiometabolic risk from the habit lever.

### OUTPUT FORMAT — JSON ONLY (no markdown, no backticks):
{
  "biological_age": number,
  "health_score": number,
  "age_summary": "string — empathetic clinical explanation of why biological age differs from chronological, max 2 sentences",
  "the_down_2040": "string",
  "the_growth_2040": "string",
  "habit_lever": "string — name of the single best habit to change",
  "improvement_impact": "string — e.g. '23% reduction in 10-year heart disease risk'",
  "action_plan": ["Action 1", "Action 2", "Action 3"]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok) {
      console.error("Gemini API Error:", await res.text());
      return fallback(age);
    }

    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("JSON parse error from Gemini:", text.slice(0, 300));
      return fallback(age);
    }

    return {
      biologicalAge: result.biological_age ?? age,
      healthScore: result.health_score ?? 50,
      futurePrediction: result.age_summary
        ? `${result.age_summary} ${result.the_down_2040}`
        : result.the_down_2040,
      simulation: `${result.the_growth_2040}\n\nBest habit to change: ${result.habit_lever}\nImpact: ${result.improvement_impact}`,
      recommendations: Array.isArray(result.action_plan)
        ? result.action_plan.join("\n")
        : result.action_plan,
      habitLever: result.habit_lever,
      improvementImpact: result.improvement_impact,
    };
  } catch (err) {
    console.error("AI Service Error:", err);
    return fallback(age);
  }
}

function fallback(age) {
  return {
    biologicalAge: age,
    healthScore: 50,
    futurePrediction: "Unable to generate prediction at this time.",
    simulation: "Unable to generate simulation at this time.",
    recommendations: "Unable to fetch AI recommendations.",
    habitLever: null,
    improvementImpact: null,
  };
}
