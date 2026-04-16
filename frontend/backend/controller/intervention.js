import { simulateIntervention } from '../utils/intervention.js';
import AdminAction from '../models/admin.js';
import { getHighRiskZones } from '../services/zone.js';

export const simulateAction = async (req, res) => {
  try {
    const { actionType, city, zone, aqiBeforeAction, durationMinutes, description } = req.body;

    if (!actionType || !city || !aqiBeforeAction || !description) {
      return res.status(400).json({
        success: false,
        message: 'Action type, city, current AQI, and description are required',
      });
    }

    if (aqiBeforeAction < 0 || aqiBeforeAction > 500) {
      return res.status(400).json({
        success: false,
        message: 'AQI must be between 0 and 500',
      });
    }

    const validActions = ['water_spray', 'traffic_control', 'construction_halt', 'vehicle_restriction', 'public_advisory', 'other'];
    if (!validActions.includes(actionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action type',
      });
    }

    const simulation = simulateIntervention({
      actionType,
      aqiBeforeAction,
      zone,
      durationMinutes: durationMinutes || 60,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...simulation,
        city,
        description,
      },
      message: 'Simulation completed successfully',
    });
  } catch (error) {
    console.error('Simulate Action Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run simulation',
    });
  }
};

export const logIntervention = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. Only city controllers can log interventions.',
      });
    }

    const {
      actionType,
      city,
      zone,
      description,
      aqiBeforeAction,
      aqiAfterAction,
      isSimulation = false,
    } = req.body;

    if (!actionType || !city || !description || !aqiBeforeAction) {
      return res.status(400).json({
        success: false,
        message: 'Action type, city, description, and current AQI are required',
      });
    }

    if (aqiBeforeAction < 0 || aqiBeforeAction > 500) {
      return res.status(400).json({
        success: false,
        message: 'AQI before action must be between 0 and 500',
      });
    }

    if (aqiAfterAction && (aqiAfterAction < 0 || aqiAfterAction > 500)) {
      return res.status(400).json({
        success: false,
        message: 'AQI after action must be between 0 and 500',
      });
    }

    const simulation = simulateIntervention({
      actionType,
      aqiBeforeAction,
      zone,
    });

    const action = await AdminAction.create({
      adminId: req.user._id,
      actionType,
      city,
      zone,
      description,
      aqiBeforeAction,
      aqiAfterAction: aqiAfterAction || simulation.aqiAfterAction,
      isSimulation,
      estimatedImpact: simulation.estimatedImpact,
    });

    await action.populate('adminId', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Intervention logged successfully',
      data: action,
    });
  } catch (error) {
    console.error('❌ Log Intervention Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to log intervention',
    });
  }
};

export const getInterventions = async (req, res) => {
  try {
    const { city } = req.params;
    const { limit = 10, page = 1 } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const interventions = await AdminAction.find({ city })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adminId', 'name email');

    const total = await AdminAction.countDocuments({ city });

    return res.status(200).json({
      success: true,
      data: interventions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get Interventions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interventions',
    });
  }
};

export const getHighRiskZonesController = async (req, res) => {
  try {
    const { city } = req.params;
    const { threshold = 150 } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required',
      });
    }

    const zones = getHighRiskZones(city, parseInt(threshold));

    return res.status(200).json({
      success: true,
      data: zones,
      message: zones.length > 0 
        ? `Found ${zones.length} high-risk zone${zones.length > 1 ? 's' : ''}`
        : 'No high-risk zones found',
    });
  } catch (error) {
    console.error('❌ Get High Risk Zones Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch high-risk zones',
    });
  }
};

import User from '../models/user.js';

export const getUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        users,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('❌ Get Users Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete another admin account',
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};