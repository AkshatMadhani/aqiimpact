import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const isProd = config.nodeEnv === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

export const register = async (req, res) => {
  try {
    const { name, email, password, age, healthConditions, city, preExistingDiseases } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const allConditions = [
      ...(healthConditions || []),
      ...(preExistingDiseases || []),
    ];
    const unique = [...new Set(allConditions)].filter(Boolean);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      age: age || null,
      healthConditions: unique,
      preExistingDiseases: preExistingDiseases || [],
      city: city || 'Delhi',
    });

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpire });

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          ageGroup: user.ageGroup,
          city: user.city,
          role: user.role,
          healthConditions: user.healthConditions,
          preExistingDiseases: user.preExistingDiseases,
          mapboxApiKey: user.mapboxApiKey || null,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpire });

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          ageGroup: user.ageGroup,
          city: user.city,
          role: user.role,
          healthConditions: user.healthConditions,
          preExistingDiseases: user.preExistingDiseases,
          mapboxApiKey: user.mapboxApiKey || null,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.status(200).json({ success: true, message: 'Logout successful' });
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, age, healthConditions, preExistingDiseases, city, alertThreshold, mapboxApiKey } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (healthConditions !== undefined) updateData.healthConditions = healthConditions;
    if (preExistingDiseases !== undefined) updateData.preExistingDiseases = preExistingDiseases;
    if (city !== undefined) updateData.city = city;
    if (alertThreshold !== undefined) updateData.alertThreshold = alertThreshold;
    if (mapboxApiKey !== undefined) updateData.mapboxApiKey = mapboxApiKey;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};