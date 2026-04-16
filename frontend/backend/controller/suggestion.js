import { getPersonalizedSuggestions } from '../services/service.js';
import { fetchAQI } from '../services/api.js';
import { calculateExposure } from '../utils/exposure.js';

export const getSuggestions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for personalized suggestions',
      });
    }

    const { city, activity = 'walking', timeMinutes = 30 } = req.body;
    const aqiData = await fetchAQI(city || req.user.city);
    const exposureData = calculateExposure(
      aqiData.aqi,
      timeMinutes,
      activity,
      req.user.ageGroup,
      req.user.healthConditions
    );

    const suggestions = await getPersonalizedSuggestions(
      req.user,
      aqiData,
      { ...exposureData, activity }
    );

    return res.status(200).json({
      success: true,
      data: {
        suggestions,
        context: {
          aqi: aqiData.aqi,
          category: aqiData.category,
          riskLevel: exposureData.riskLevel,
        },
      },
    });
  } catch (error) {
    console.error('Get Suggestions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};