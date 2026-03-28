export function calculatePrediction({ age, sleepHours, stepsPerDay, stressLevel }) {
  // Biological Age
  let biologicalAge = age;
  if (sleepHours < 6) biologicalAge += 5;
  if (stepsPerDay < 4000) biologicalAge += 3;
  if (stressLevel > 7) biologicalAge += 2;

  // Risk Prediction
  let riskScore = 0;
  if (sleepHours < 6) riskScore += 2;
  if (stepsPerDay < 4000) riskScore += 2;
  if (stressLevel > 7) riskScore += 2;

  let riskLevel = "Low";
  if (riskScore >= 5) {
    riskLevel = "High";
  } else if (riskScore >= 3) {
    riskLevel = "Medium";
  }

  // Future Prediction
  const futurePrediction = "Based on current habits, you may face increased health risks in the next 5–10 years.";

  return { biologicalAge, riskLevel, futurePrediction, riskScore };
}
