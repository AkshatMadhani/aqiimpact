import axios from 'axios';
import NodeCache from 'node-cache';
import config from '../config/env.js';
import AQILog from '../models/aqi.js';
import { AQI_CATEGORIES } from '../config/constant.js';

const cache = new NodeCache({ stdTTL: 600 });

const getAQICategory = (aqi) => {
  for (const [key, value] of Object.entries(AQI_CATEGORIES)) {
    if (aqi >= value.min && aqi <= value.max) {
      return value.label;
    }
  }
  return 'Unknown';
};

export const fetchAQI = async (city) => {
  try {
    const cachedData = cache.get(city);
    if (cachedData) {
      console.log(`Cache hit for ${city}`);
      return cachedData;
    }

    if (!config.aqiApiKey) {
      throw new Error('AQI_API_KEY not configured');
    }

    const url = `${config.aqiApiUrl}/${city}/?token=${config.aqiApiKey}`;
    const response = await axios.get(url);

    if (response.data.status !== 'ok') {
      throw new Error('Invalid API response');
    }

    const data = response.data.data;
    const aqiData = {
      city,
      aqi: data.aqi,
      category: getAQICategory(data.aqi),
      dominantPollutant: data.dominentpol || 'PM2.5',
      pollutants: {
        pm25: data.iaqi?.pm25?.v || null,
        pm10: data.iaqi?.pm10?.v || null,
        o3: data.iaqi?.o3?.v || null,
        no2: data.iaqi?.no2?.v || null,
        so2: data.iaqi?.so2?.v || null,
        co: data.iaqi?.co?.v || null,
      },
      timestamp: new Date(data.time.iso),
      source: 'WAQI',
    };

    cache.set(city, aqiData);
    await AQILog.create(aqiData);

    return aqiData;
  } catch (error) {
    console.error(` Error fetching AQI for ${city}:`, error.message);
    throw new Error(`Failed to fetch AQI data: ${error.message}`);
  }
};

export const getHistoricalAQI = async (city, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await AQILog.find({
    city,
    timestamp: { $gte: startDate },
  }).sort({ timestamp: -1 });

  return data;
};