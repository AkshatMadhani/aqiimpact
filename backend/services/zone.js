const zones = {
    Delhi: {
      'Zone A': { baseAQI: 180, areas: ['Connaught Place', 'Rajiv Chowk'] },
      'Zone B': { baseAQI: 220, areas: ['Anand Vihar', 'ITO'] },
      'Zone C': { baseAQI: 150, areas: ['Nehru Place', 'Lajpat Nagar'] },
    },
    Mumbai: {
      'Zone A': { baseAQI: 120, areas: ['Bandra', 'Andheri'] },
      'Zone B': { baseAQI: 100, areas: ['Worli', 'Colaba'] },
      'Zone C': { baseAQI: 140, areas: ['Thane', 'Mulund'] },
    },
  };
  
  export const getZoneData = (city, zoneName) => {
    return zones[city]?.[zoneName] || { baseAQI: 100, areas: ['Unknown'] };
  };
  
  export const getAllZones = (city) => {
    return zones[city] || {};
  };
  
  export const getHighRiskZones = (city, threshold = 150) => {
    const cityZones = zones[city] || {};
    
    return Object.entries(cityZones)
      .filter(([_, data]) => data.baseAQI > threshold)
      .map(([name, data]) => ({ zone: name, aqi: data.baseAQI, areas: data.areas }));
  };