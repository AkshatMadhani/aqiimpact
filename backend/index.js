import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import config from './config/env.js';
import errorHandler from './middleware/error.js';
import authRoutes from './routes/auth.js';
import aqiRoutes from './routes/aqi.js';
import exposureRoutes from './routes/exposure.js';
import routeRoutes from './routes/route.js';
import policyRoutes from './routes/policy.js';
import interventionRoutes from './routes/intervention.js';
import suggestionRoutes from './routes/suggestion.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://aqiimpact.vercel.app/',
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); 
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AirImpact API is running',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/exposure', exposureRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(` CORS enabled for: ${allowedOrigins.join(', ')}\n`);
});