import { fetchAQI,getHistoricalAQI } from "../services/api.js";
export const getCurrentAQI = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required',
      });
    }

    const aqiData = await fetchAQI(city);

    return res.status(200).json({
      success: true,
      data: aqiData,
    });
  } catch (error) {
    console.error('Get AQI Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch AQI data',
    });
  }
};

export const getHistorical = async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 7 } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required',
      });
    }

    const data = await getHistoricalAQI(city, parseInt(days));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get Historical Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
    });
  }
};
