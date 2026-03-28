export async function generateAiInsights({ age, sleepHours, stepsPerDay, exerciseMinutes, stressLevel }) {
  try {
    const prompt = `Act as the 'GoodAI Antigravity Engine,' a sophisticated biological age estimator and health future simulator[cite: 57, 58]. Your goal is to help the user avoid the 'Breakdown Trap' of reactive medicine[cite: 14, 18].

### INPUT DATA:
User Age: ${age}
Sleep: ${sleepHours} hours
Steps: ${stepsPerDay}
Exercise: ${exerciseMinutes} mins
Stress: ${stressLevel}/10

### LOGIC CONSTRAINTS:
1. THE MIRROR (Biological Age): Use the input to calculate a biological age[cite: 57]. 
   - Baseline is chronological age.
   - Penalties: +1.5 years for sleep < 7h; +2 years for 'High' stress[cite: 92] (Stress >= 7).
   - Bonuses: -1 year for steps > 8,000; -0.5 years for daily exercise > 30 mins.
2. THE TIME MACHINE (2040 Projection): Predict health status in 2040 if current habits persist[cite: 59, 77]. 
3. THE GROWTH SIMULATION: Identify ONE habit to change (e.g., +1 hour sleep). Recalculate the 2040 projection to show a "Reduced Risk"[cite: 52, 80].
4. THE COACH: Provide 3 'Micro-Commitments' that are clear, actionable, and personal[cite: 61, 83].

### OUTPUT FORMAT (JSON ONLY):
{
  "biological_age": number,
  "age_summary": "Short 1-line explanation of why (e.g., '+2 years due to high stress')",
  "the_down_2040": "A vivid, cautionary 2-sentence description of health risks if habits don't change",
  "the_growth_2040": "A vivid, inspiring 2-sentence description of the future after 1 habit change",
  "improvement_impact": "Percentage reduction in long-term heart/metabolic risk",
  "action_plan": ["Action 1", "Action 2", "Action 3"]
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!res.ok) {
      console.error("Gemini API Error:", await res.text());
      return { 
        biologicalAge: age,
        futurePrediction: "Unable to calculate future prediction at this time.",
        simulation: "Unable to generate simulation at this time.", 
        recommendations: "Unable to fetch AI recommendations." 
      };
    }

    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean markdown if AI accidentally included it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const result = JSON.parse(text);
    return {
      biologicalAge: result.biological_age || age,
      futurePrediction: result.age_summary ? `[${result.age_summary}] ${result.the_down_2040}` : result.the_down_2040,
      simulation: `${result.the_growth_2040}\n\nMetrics Impact: ${result.improvement_impact}`,
      recommendations: Array.isArray(result.action_plan) ? result.action_plan.join('\n') : result.action_plan
    };
  } catch (err) {
    console.error("AI Service Error:", err);
    return {
      biologicalAge: age,
      futurePrediction: "Error analyzing long-term risks.",
      simulation: "Error generating simulation.",
      recommendations: "Error generating recommendations."
    };
  }
}
