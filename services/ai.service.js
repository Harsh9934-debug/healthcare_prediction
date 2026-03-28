export async function generateAiInsights({ age, sleepHours, stepsPerDay, exerciseMinutes, stressLevel }) {
  try {
    const prompt = `Based on a person who is ${age} years old, gets ${sleepHours} hours of sleep, takes ${stepsPerDay} steps per day, exercises for ${exerciseMinutes} minutes, and has a stress level of ${stressLevel}/10. 
Provide your response strictly as a JSON object with two string fields:
1. "simulation": A short sentence picking one habit to improve (e.g. increasing sleep or steps) and how it would improve projected health.
2. "recommendations": 2-3 short, actionable health recommendations separated by newlines.
Do not wrap the JSON in Markdown. Just return the raw JSON object.`;
    
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
      simulation: result.simulation || "Improve sleep or steps to slightly reduce your risk.",
      recommendations: result.recommendations || "No recommendations generated. Try to balance sleep, steps, and stress."
    };
  } catch (err) {
    console.error("AI Service Error:", err);
    return {
      simulation: "Error generating simulation.",
      recommendations: "Error generating recommendations."
    };
  }
}
