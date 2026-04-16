import { ACTIVITY_MULTIPLIERS, HEALTH_MULTIPLIERS } from '../config/constant.js';
export const calculateRouteCost = (zones, activity = 'walking') => {
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activity] || 1.0;
  
  let totalCost = 0;
  const breakdown = zones.map((zone) => {
    const cost = zone.aqi * zone.timeMinutes * activityMultiplier;
    totalCost += cost;
    return {
      zone: zone.name,
      aqi: zone.aqi,
      timeMinutes: zone.timeMinutes,
      cost: Math.round(cost),
    };
  });

  return {
    totalCost: Math.round(totalCost),
    breakdown,
    averageAQI: Math.round(
      zones.reduce((sum, z) => sum + z.aqi, 0) / zones.length
    ),
  };
};

export const compareRoutes = (routes) => {
  const results = routes.map((route) => ({
    routeName: route.name,
    ...calculateRouteCost(route.zones, route.activity),
  }));

  const minCost = Math.min(...results.map((r) => r.totalCost));
  const bestRoute = results.find((r) => r.totalCost === minCost)?.routeName;

  return {
    bestRoute,
    comparison: results.map((r) => ({
      ...r,
      percentageDiff: Math.round(((r.totalCost - minCost) / minCost) * 100),
    })),
  };
};

export const calculateRouteRisk = (avgAQI, exposureScore) => {
  if (exposureScore > 25000) return { level: 'VERY_HIGH', color: '#DC2626' };
  if (exposureScore > 15000) return { level: 'HIGH', color: '#EF4444' };
  if (exposureScore > 10000) return { level: 'MODERATE', color: '#F59E0B' };
  return { level: 'LOW', color: '#10B981' };
};

export const estimateTime = (distanceKm, mode) => {
  const speeds = {
    walking: 5,   
    cycling: 15,  
    driving: 30,  
  };
  
  const speed = speeds[mode] || speeds.walking;
  return Math.round((distanceKm / speed) * 60); 
};