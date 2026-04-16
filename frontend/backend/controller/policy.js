import { fetchAQI } from '../services/api.js';
import { getPolicyRecommendations } from '../utils/policy.js';
export const getCityPolicy = async (req, res) => {
  try {
    const { city, aqi: providedAQI } = req.query;

    let aqi;
    if (providedAQI) {
      aqi = parseInt(providedAQI);
    } else if (city) {
      const aqiData = await fetchAQI(city);
      aqi = aqiData.aqi;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either AQI or city must be provided',
      });
    }

    const recommendations = getPolicyRecommendations(aqi);

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Get Policy Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};