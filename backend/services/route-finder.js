import axios from 'axios';
import * as turf from '@turf/turf';
import { ACTIVITY_MULTIPLIERS, HEALTH_MULTIPLIERS } from '../config/constant.js';

export const geocodePlace = async (placeName, mapboxToken) => {
  try {
    console.log(`🔍 Geocoding: "${placeName}"`);
    
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json`,
      {
        params: {
          access_token: mapboxToken,
          limit: 1,
        },
      }
    );

    if (response.data.features.length > 0) {
      const [lng, lat] = response.data.features[0].center;
      const result = {
        lat,
        lng,
        name: response.data.features[0].place_name,
      };
      console.log(`✅ Geocoded "${placeName}" →`, result);
      return result;
    }
    
    console.error(`❌ No results for "${placeName}"`);
    return null;
  } catch (error) {
    console.error('❌ Geocoding error:', error.message);
    throw new Error(`Failed to find location: ${placeName}`);
  }
};

export const getMapboxRoutes = async (from, to, mode, mapboxToken) => {
  try {
    const profile = mode === 'walking' ? 'walking' : mode === 'cycling' ? 'cycling' : 'driving';
    
    console.log(`🗺️ Fetching ${profile} routes from Mapbox...`);
    console.log(`   From: [${from.lng}, ${from.lat}]`);
    console.log(`   To: [${to.lng}, ${to.lat}]`);
    
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}`,
      {
        params: {
          alternatives: true,
          geometries: 'geojson',
          steps: true,
          access_token: mapboxToken,
        },
      }
    );

    const routes = response.data.routes || [];
    console.log(`Mapbox returned ${routes.length} route(s)`);
    
    routes.forEach((route, i) => {
      console.log(`   Route ${i}: ${route.geometry.coordinates.length} coordinates, ${(route.distance/1000).toFixed(2)}km`);
    });

    return routes;
  } catch (error) {
    console.error('❌ Mapbox route fetch error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    throw new Error('Failed to fetch routes from Mapbox');
  }
};

export const getAQIForCoordinates = async (lat, lng, aqiToken) => {
  try {
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${aqiToken}`
    );

    if (response.data.status === 'ok') {
      return response.data.data.aqi;
    }
    return 150; 
  } catch (error) {
    console.error('AQI fetch error:', error.message);
    return 150; 
  }
};

export const getNearbyStations = async (bounds, aqiToken) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    
    console.log(`🌍 Fetching AQI stations in bounds:`, bounds);
    
    const response = await axios.get(
      `https://api.waqi.info/v2/map/bounds/`,
      {
        params: {
          latlng: `${minLat},${minLng},${maxLat},${maxLng}`,
          token: aqiToken,
        },
      }
    );

    if (response.data.status === 'ok') {
      const stations = response.data.data.map(station => ({
        lat: station.lat,
        lng: station.lon,
        aqi: station.aqi,
        name: station.station.name,
      }));
      
      console.log(`Found ${stations.length} AQI stations`);
      return stations;
    }
    
    console.warn('No AQI stations found, using fallback');
    return [];
  } catch (error) {
    console.error('AQI stations fetch error:', error.message);
    return [];
  }
};

export const calculateRouteExposure = (route, aqiPoints, userProfile) => {
  let totalExposure = 0;
  let totalDistance = 0;
  let maxAQI = 0;
  let minAQI = 500;

  const healthConditions = userProfile?.healthConditions || [];
  let healthMultiplier = 1.0;
  if (healthConditions.length > 0) {
    healthMultiplier = Math.max(
      ...healthConditions.map(condition => HEALTH_MULTIPLIERS[condition] || 1.0)
    );
  }

  const coordinates = route.geometry.coordinates;
  const sampleRate = Math.max(1, Math.floor(coordinates.length / 20)); 

  for (let i = 0; i < coordinates.length; i += sampleRate) {
    const [lng, lat] = coordinates[i];
    
  
    let nearestAQI = 150; 
    let minDist = Infinity;
    
    aqiPoints.forEach(station => {
      const dist = turf.distance(
        turf.point([lng, lat]),
        turf.point([station.lng, station.lat]),
        { units: 'kilometers' }
      );
      if (dist < minDist) {
        minDist = dist;
        nearestAQI = station.aqi;
      }
    });

    if (i > 0) {
      const prevIndex = Math.max(0, i - sampleRate);
      const [prevLng, prevLat] = coordinates[prevIndex];
      const segmentDist = turf.distance(
        turf.point([prevLng, prevLat]),
        turf.point([lng, lat]),
        { units: 'kilometers' }
      );
      
      totalDistance += segmentDist;
      totalExposure += segmentDist * nearestAQI * healthMultiplier;
    }

    maxAQI = Math.max(maxAQI, nearestAQI);
    minAQI = Math.min(minAQI, nearestAQI);
  }

  const avgAQI = totalDistance > 0 ? totalExposure / totalDistance : 150;
  
  return {
    exposureScore: Math.round(totalExposure),
    avgAQI: Math.round(avgAQI),
    maxAQI,
    minAQI,
    distance: totalDistance,
  };
};

export const findOptimalRoutes = async (fromPlace, toPlace, mode, userProfile, config) => {
  try {
    console.log('\n🚀 === FINDING OPTIMAL ROUTES ===');
    console.log(`   From: "${fromPlace}"`);
    console.log(`   To: "${toPlace}"`);
    console.log(`   Mode: ${mode}`);
    
    const userMapboxToken = config.mapboxApiKey;
    
    if (!userMapboxToken) {
      throw new Error('Mapbox API key required. Please add your free token in Settings.');
    }
    
    console.log('🔑 Using user Mapbox token (backend secure call)');
    
    const from = await geocodePlace(fromPlace, userMapboxToken);
    const to = await geocodePlace(toPlace, userMapboxToken);

    if (!from || !to) {
      throw new Error('Could not find one or both locations');
    }

    const routes = await getMapboxRoutes(from, to, mode, userMapboxToken);

    if (routes.length === 0) {
      throw new Error('No routes found between these locations');
    }

    const bounds = {
      minLat: Math.min(from.lat, to.lat) - 0.1,
      maxLat: Math.max(from.lat, to.lat) + 0.1,
      minLng: Math.min(from.lng, to.lng) - 0.1,
      maxLng: Math.max(from.lng, to.lng) + 0.1,
    };

    const aqiStations = await getNearbyStations(bounds, config.aqiApiKey);
    
    const aqiPoints = aqiStations.length > 0 ? aqiStations : [
      { lat: from.lat, lng: from.lng, aqi: 100, name: 'Fallback Station' }
    ];

    console.log(`📊 Calculating exposure for ${routes.length} route(s)...`);

    const routesWithExposure = routes.map((route, index) => {
      const exposure = calculateRouteExposure(route, aqiPoints, userProfile);
      
      const result = {
        id: index,
        name: index === 0 ? 'Fastest Route' : `Alternative ${index}`,
        from: from.name,
        to: to.name,
        mode,
        distance: parseFloat((route.distance / 1000).toFixed(2)),
        ...exposure,
        geometry: route.geometry, 
        legs: route.legs,
      };

      console.log(`   Route ${index}:`, {
        name: result.name,
        distance: result.distance + 'km',
        duration: result.duration + 'min',
        avgAQI: result.avgAQI,
        exposureScore: result.exposureScore,
        geometryType: result.geometry.type,
        coordinateCount: result.geometry.coordinates.length
      });

      return result;
    });


    routesWithExposure.sort((a, b) => a.exposureScore - b.exposureScore);

    if (routesWithExposure.length > 0) {
      routesWithExposure[0].name = 'Cleanest Air Route';
      routesWithExposure[0].recommended = true;
    }
    if (routesWithExposure.length > 1) {
      routesWithExposure[1].name = 'Balanced Route';
    }
    if (routesWithExposure.length > 2) {
      routesWithExposure[2].name = 'Fastest Route';
    }

    console.log(`Returning ${routesWithExposure.length} routes`);
    console.log(`   Best route: ${routesWithExposure[0].name} (AQI: ${routesWithExposure[0].avgAQI})`);
    console.log('=================================\n');

    return {
      routes: routesWithExposure,
      from,
      to,
      aqiStations: aqiPoints,
    };
  } catch (error) {
    console.error('Route finding error:', error.message);
    throw error;
  }
};