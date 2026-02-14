import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AirImpact API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
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

const PORT = process.env.PORT || config.port || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AirImpact Backend running on port ${PORT} [${config.nodeEnv}]`);
});