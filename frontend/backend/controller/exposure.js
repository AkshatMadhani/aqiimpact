import { calculateExposure, getRiskExplanation } from '../utils/exposure.js';
import { fetchAQI } from '../services/api.js';
import { getPersonalizedSuggestions } from '../services/service.js';
import ExposureHistory from '../models/exposure.js';

export const calculatePersonalExposure = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to calculate exposure',
      });
    }

    const { city, timeMinutes, activity, aqi: providedAQI } = req.body;

    if (!timeMinutes || !activity) {
      return res.status(400).json({
        success: false,
        message: 'Time and activity are required',
      });
    }

    let aqiData;
    if (providedAQI) {
      aqiData = { aqi: providedAQI, city };
    } else if (city) {
      aqiData = await fetchAQI(city);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either AQI or city must be provided',
      });
    }

    const ageGroup = req.user.ageGroup;
    const healthConditions = req.user.healthConditions || [];
    const userId = req.user._id;

    const exposureResult = calculateExposure(
      aqiData.aqi,
      timeMinutes,
      activity,
      ageGroup,
      healthConditions
    );

    const explanation = getRiskExplanation(exposureResult.riskLevel);

    let suggestions = [];
    if (process.env.GROQ_API_KEY) {
      try {
        suggestions = await getPersonalizedSuggestions(
          req.user,
          aqiData,
          { ...exposureResult, activity }
        );
      } catch (error) {
        console.warn('AI suggestions failed:', error.message);
      }
    }

    await ExposureHistory.create({
      userId,
      exposureScore: exposureResult.exposureScore,
      riskLevel: exposureResult.riskLevel,
      aqi: aqiData.aqi,
      activity,
      durationMinutes: timeMinutes,
      city: aqiData.city,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...exposureResult,
        explanation,
        suggestions,
        aqiData,
      },
    });
  } catch (error) {
    console.error('Calculate Exposure Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getExposureHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const history = await ExposureHistory.find({
      userId: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    const totalExposure = history.reduce((sum, h) => sum + h.exposureScore, 0);
    const avgExposure = history.length > 0 ? Math.round(totalExposure / history.length) : 0;

    return res.status(200).json({
      success: true,
      data: {
        history,
        statistics: {
          totalRecords: history.length,
          averageExposure: avgExposure,
          totalExposure,
        },
      },
    });
  } catch (error) {
    console.error('Get Exposure History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};