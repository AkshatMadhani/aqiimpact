export const AQI_CATEGORIES = {
    GOOD: { min: 0, max: 50, label: 'Good', color: '#00e400' },
    MODERATE: { min: 51, max: 100, label: 'Moderate', color: '#ffff00' },
    UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: 'Unhealthy for Sensitive', color: '#ff7e00' },
    UNHEALTHY: { min: 151, max: 200, label: 'Unhealthy', color: '#ff0000' },
    VERY_UNHEALTHY: { min: 201, max: 300, label: 'Very Unhealthy', color: '#8f3f97' },
    HAZARDOUS: { min: 301, max: 500, label: 'Hazardous', color: '#7e0023' },
  };
  
  export const ACTIVITY_MULTIPLIERS = {
    resting: 1.0,
    walking: 1.3,
    cycling: 1.8,
    running: 2.5,
    commuting: 1.2,
  };
  
  export const AGE_MULTIPLIERS = {
    child: 1.3,
    adult: 1.0,
    senior: 1.4,
  };
  
  export const HEALTH_MULTIPLIERS = {
    none: 1.0,
    asthma: 1.6,
    copd: 1.8,
    heart_disease: 1.5,
    diabetes: 1.2,
  };
  
  export const RISK_THRESHOLDS = {
    LOW: 5000,
    MODERATE: 10000,
    HIGH: 15000,
    VERY_HIGH: 25000,
    HAZARDOUS: 35000,
  };
  
  export const POLICY_THRESHOLDS = {
    ADVISORY: 101,
    RESTRICTIONS: 151,
    EMERGENCY: 201,
    SEVERE_EMERGENCY: 301,
  };