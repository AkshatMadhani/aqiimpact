import { 
  ACTIVITY_MULTIPLIERS, 
  AGE_MULTIPLIERS, 
  HEALTH_MULTIPLIERS,
  RISK_THRESHOLDS 
} from '../config/constant.js';

export const calculateExposure = (aqi, timeMinutes, activity, ageGroup, healthConditions = []) => {
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activity] || 1.0;
  const ageMultiplier = AGE_MULTIPLIERS[ageGroup] || 1.0;
  
  let healthMultiplier = 1.0;
  if (healthConditions.length > 0) {
    const multipliers = healthConditions
      .map(condition => HEALTH_MULTIPLIERS[condition] || 1.0);
    healthMultiplier = Math.max(...multipliers);
  }

  const exposureScore = Math.round(
    aqi * timeMinutes * activityMultiplier * ageMultiplier * healthMultiplier
  );

  let riskLevel = 'LOW';
  if (exposureScore > RISK_THRESHOLDS.HAZARDOUS) riskLevel = 'HAZARDOUS';
  else if (exposureScore > RISK_THRESHOLDS.VERY_HIGH) riskLevel = 'VERY_HIGH';
  else if (exposureScore > RISK_THRESHOLDS.HIGH) riskLevel = 'HIGH';
  else if (exposureScore > RISK_THRESHOLDS.MODERATE) riskLevel = 'MODERATE';

  return {
    exposureScore,
    riskLevel,
    breakdown: {
      baseAQI: aqi,
      timeMinutes,
      activityMultiplier,
      ageMultiplier,
      healthMultiplier,
      totalMultiplier: (activityMultiplier * ageMultiplier * healthMultiplier).toFixed(2),
    },
  };
};

export const getRiskExplanation = (riskLevel) => {
  const explanations = {
    LOW: 'Your exposure is within safe limits. Continue your activities as planned.',
    MODERATE: 'Moderate exposure detected. Consider reducing time outdoors if sensitive.',
    HIGH: 'High exposure risk. Limit outdoor activities and wear a mask if possible.',
    VERY_HIGH: 'Very high exposure. Minimize outdoor time and avoid strenuous activities.',
    HAZARDOUS: 'Hazardous exposure levels. Stay indoors and use air purifiers if available.',
  };
  return explanations[riskLevel] || 'Unable to determine risk level.';
};
export const calculateHealthImpact = (exposureScore, userProfile) => {
  const { ageGroup, healthConditions } = userProfile;
  
  let baseImpact = Math.min(100, (exposureScore / RISK_THRESHOLDS.HAZARDOUS) * 100);
  
  if (ageGroup === 'child' || ageGroup === 'senior') {
    baseImpact *= 1.2;
  }
  
  if (healthConditions.includes('asthma') || healthConditions.includes('copd')) {
    baseImpact *= 1.3;
  }
  
  return Math.min(100, Math.round(baseImpact));
};