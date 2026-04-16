import { POLICY_THRESHOLDS } from '../config/constant.js';

export const getPolicyRecommendations = (aqi) => {
  const recommendations = {
    level: '',
    color: '',
    policies: [],
    publicAdvisory: '',
    targetGroups: [],
  };

  if (aqi < POLICY_THRESHOLDS.ADVISORY) {
    recommendations.level = 'Normal Operations';
    recommendations.color = '#10B981';
    recommendations.policies = [
      'Continue regular monitoring',
      'Maintain green cover',
      'Promote public transport usage',
    ];
    recommendations.publicAdvisory = 'Air quality is satisfactory. Normal outdoor activities are safe.';
    recommendations.targetGroups = ['General public: No restrictions'];
  } else if (aqi < POLICY_THRESHOLDS.RESTRICTIONS) {
    recommendations.level = 'Advisory Stage';
    recommendations.color = '#F59E0B';
    recommendations.policies = [
      'Issue public health advisory',
      'Increase frequency of air quality monitoring',
      'Reduce construction dust through water spraying',
      'Enforce strict pollution control in industries',
    ];
    recommendations.publicAdvisory = 
      'Air quality may cause breathing discomfort. Sensitive groups should limit outdoor exertion.';
    recommendations.targetGroups = [
      'Children and elderly: Limit outdoor activities',
      'People with asthma/respiratory issues: Take precautions',
      'General public: Reduce prolonged exposure',
    ];
  } else if (aqi < POLICY_THRESHOLDS.EMERGENCY) {
    recommendations.level = 'Restriction Stage';
    recommendations.color = '#EF4444';
    recommendations.policies = [
      'Implement odd-even vehicle restrictions',
      'Ban diesel generators',
      'Stop/regulate construction activities',
      'Increase public transport frequency',
      'Deploy water sprinklers at major roads',
      'Enforce strict penalties for open burning',
      'Close schools if AQI persists',
    ];
    recommendations.publicAdvisory = 
      'Air quality is unhealthy for everyone. Reduce outdoor exertion. Wear N95 masks.';
    recommendations.targetGroups = [
      'Schools: Consider closure or indoor activities only',
      'Outdoor workers: Provide protective equipment',
      'Vulnerable groups: Stay indoors',
      'General public: Minimize outdoor exposure',
    ];
  } else if (aqi < POLICY_THRESHOLDS.SEVERE_EMERGENCY) {
    recommendations.level = 'Emergency Stage';
    recommendations.color = '#7C3AED';
    recommendations.policies = [
      'Declare air quality emergency',
      'Close schools and educational institutions',
      'Implement complete vehicle restrictions',
      'Halt all construction and demolition',
      'Shut down polluting industries',
      'Deploy anti-smog guns',
      'Emergency road cleaning and water sprinkling',
      'Ban entry of heavy vehicles',
      'Work from home advisory for offices',
    ];
    recommendations.publicAdvisory = 
      'Health alert: Everyone may experience health effects. Stay indoors and use air purifiers.';
    recommendations.targetGroups = [
      'Schools: Mandatory closure',
      'Offices: Work from home',
      'Hospitals: Increase emergency preparedness',
      'All citizens: Stay indoors, use air purifiers',
    ];
  } else {
    recommendations.level = 'Severe Emergency';
    recommendations.color = '#991B1B';
    recommendations.policies = [
      'Declare public health emergency',
      'Complete lockdown of non-essential activities',
      'Close all schools, colleges, and offices',
      'Ban all construction activities indefinitely',
      'Restrict all vehicles except emergency services',
      'Deploy cloud seeding if feasible',
      'Distribute masks to vulnerable populations',
      'Set up medical camps',
      'Coordinate with neighboring states',
    ];
    recommendations.publicAdvisory = 
      'SEVERE HEALTH EMERGENCY: Remain indoors at all times. Seal windows. Use air purifiers.';
    recommendations.targetGroups = [
      'All citizens: Stay indoors mandatory',
      'Hospitals: Emergency mode',
      'Essential services only: Provide N95+ masks',
    ];
  }

  if (aqi >= POLICY_THRESHOLDS.ADVISORY) {
    recommendations.policies.push(
      'Real-time AQI display at public places',
      'SMS/app alerts to citizens',
      'Increase medical staff at hospitals'
    );
  }

  return recommendations;
};