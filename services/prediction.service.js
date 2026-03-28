export function calculatePrediction({ age, sleepHours, stepsPerDay, stressLevel, bmi }) {
  let riskScore = 0;

  if (sleepHours < 5) riskScore += 4;
  else if (sleepHours < 7) riskScore += 2;

  if (stepsPerDay < 4000) riskScore += 3;
  else if (stepsPerDay < 7000) riskScore += 1;

  if (stressLevel >= 8) riskScore += 4;
  else if (stressLevel >= 6) riskScore += 2;

  if (bmi) {
    if (bmi > 35) riskScore += 4;
    else if (bmi > 30) riskScore += 3;
    else if (bmi > 25) riskScore += 1;
  }

  let riskLevel = "Low";
  if (riskScore >= 7) {
    riskLevel = "High";
  } else if (riskScore >= 3) {
    riskLevel = "Medium";
  }

  return { biologicalAge: age, riskLevel, futurePrediction: "Fallback prediction...", riskScore };
}
