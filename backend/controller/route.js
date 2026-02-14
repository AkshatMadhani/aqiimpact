import { findOptimalRoutes } from '../services/route-finder.js';
import { calculateRouteCost, compareRoutes } from '../utils/routes.js';
import config from '../config/env.js';

export const findSmartRoutes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please login to use route finder' });
    }

    const { from, to, mode = 'driving' } = req.body;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Both "from" and "to" locations are required' });
    }

    const validModes = ['driving', 'walking', 'cycling'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ success: false, message: 'Mode must be: driving, walking, or cycling' });
    }
    const userMapboxToken = req.user.mapboxApiKey;

    if (!userMapboxToken) {
      return res.status(400).json({
        success: false,
        message: 'Please add your Mapbox API key in Settings. Each user needs their own free token.',
        requiresMapboxKey: true,
      });
    }

    if (!config.aqiApiKey) {
      return res.status(500).json({ success: false, message: 'AQI API key not configured on server.' });
    }

    console.log('🔑 Using USER Mapbox token from database (secure backend call)');
    const result = await findOptimalRoutes(from, to, mode, req.user, {
      mapboxApiKey: userMapboxToken,  
      aqiApiKey: config.aqiApiKey,
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: `Found ${result.routes.length} route alternatives`,
    });
  } catch (error) {
    console.error('Smart Route Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to find routes' });
  }
};

export const compareRoutesController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { routes } = req.body;

    if (!routes || !Array.isArray(routes) || routes.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 routes are required for comparison' });
    }

    for (const route of routes) {
      if (!route.name || !route.zones || !Array.isArray(route.zones)) {
        return res.status(400).json({ success: false, message: 'Each route must have a name and zones array' });
      }
    }

    const result = compareRoutes(routes);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Compare Routes Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const calculateSingleRoute = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { zones, activity = 'walking' } = req.body;

    if (!zones || !Array.isArray(zones)) {
      return res.status(400).json({ success: false, message: 'Zones array is required' });
    }

    const result = calculateRouteCost(zones, activity);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Calculate Route Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};