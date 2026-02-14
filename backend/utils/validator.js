export const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  
  export const validateAQI = (aqi) => {
    return typeof aqi === 'number' && aqi >= 0 && aqi <= 500;
  };
  
  export const validateActivity = (activity) => {
    const validActivities = ['resting', 'walking', 'cycling', 'running', 'commuting'];
    return validActivities.includes(activity);
  };
  
  export const validateAgeGroup = (ageGroup) => {
    const validGroups = ['child', 'adult', 'senior'];
    return validGroups.includes(ageGroup);
  };