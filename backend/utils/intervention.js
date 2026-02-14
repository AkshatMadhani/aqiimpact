const INTERVENTION_EFFECTIVENESS = {
  water_spray: {
    aqiReduction: 15,
    durationMinutes: 60,
    affectedPopulationMultiplier: 0.3,
    description: 'Water spraying reduces PM2.5 and PM10 by suppressing dust particles',
  },
  traffic_control: {
    aqiReduction: 20,
    durationMinutes: 180,
    affectedPopulationMultiplier: 0.5,
    description: 'Traffic restrictions reduce vehicular emissions significantly',
  },
  construction_halt: {
    aqiReduction: 25,
    durationMinutes: 480,
    affectedPopulationMultiplier: 0.4,
    description: 'Halting construction eliminates dust and machinery emissions',
  },
  vehicle_restriction: {
    aqiReduction: 30,
    durationMinutes: 720,
    affectedPopulationMultiplier: 0.7,
    description: 'Comprehensive vehicle restrictions have maximum impact',
  },
  public_advisory: {
    aqiReduction: 5,
    durationMinutes: 1440,
    affectedPopulationMultiplier: 0.9,
    description: 'Public advisories help reduce overall pollution-generating activities',
  },
  other: {
    aqiReduction: 10,
    durationMinutes: 120,
    affectedPopulationMultiplier: 0.3,
    description: 'Other interventions have variable effectiveness',
  },
};

const ZONE_POPULATION = {
  'Zone A': 50000,
  'Zone B': 75000,
  'Zone C': 40000,
  default: 50000,
};

export const simulateIntervention = ({ actionType, aqiBeforeAction, zone, durationMinutes }) => {
  const intervention = INTERVENTION_EFFECTIVENESS[actionType] || INTERVENTION_EFFECTIVENESS.other;
  
  const reductionPercent = intervention.aqiReduction;
  const aqiReduction = Math.round((aqiBeforeAction * reductionPercent) / 100);
  const aqiAfterAction = Math.max(0, aqiBeforeAction - aqiReduction);
  
  const zonePopulation = ZONE_POPULATION[zone] || ZONE_POPULATION.default;
  const affectedPopulation = Math.round(zonePopulation * intervention.affectedPopulationMultiplier);
  
  const exposureReductionPercent = Math.round(
    ((aqiBeforeAction - aqiAfterAction) / aqiBeforeAction) * 100
  );
  
  const actualDuration = durationMinutes || intervention.durationMinutes;
  
  return {
    actionType,
    aqiBeforeAction,
    aqiAfterAction,
    aqiReduction,
    reductionPercent: Math.round((aqiReduction / aqiBeforeAction) * 100),
    estimatedImpact: {
      exposureReduction: exposureReductionPercent,
      affectedPopulation,
      durationMinutes: actualDuration,
    },
    notes: intervention.description,
    disclaimer: 'Simulation based on average effectiveness. Actual results may vary.',
  };
};

export const calculateCostEffectiveness = (intervention) => {
  const { reductionPercent, estimatedImpact } = intervention;
  
  const effectiveness = 
    (reductionPercent * estimatedImpact.affectedPopulation) / 
    (estimatedImpact.durationMinutes / 60);
  
  const maxPossibleScore = (100 * 100000) / 1;
  const score = Math.min(100, (effectiveness / maxPossibleScore) * 100);
  
  return Math.round(score);
};

export const getRecommendedInterventions = (currentAQI) => {
  if (currentAQI <= 100) {
    return [
      { action: 'public_advisory', reason: 'Maintain current good air quality' },
    ];
  }
  
  if (currentAQI <= 200) {
    return [
      { action: 'traffic_control', reason: 'Reduce vehicular emissions' },
      { action: 'water_spray', reason: 'Suppress dust' },
    ];
  }
  
  if (currentAQI <= 300) {
    return [
      { action: 'vehicle_restriction', reason: 'Implement odd-even restrictions' },
      { action: 'construction_halt', reason: 'Halt construction activities' },
      { action: 'water_spray', reason: 'Deploy water sprinklers' },
    ];
  }
  
  return [
    { action: 'vehicle_restriction', reason: 'Complete vehicle ban' },
    { action: 'construction_halt', reason: 'Emergency halt all construction' },
    { action: 'public_advisory', reason: 'Issue health emergency' },
  ];
};