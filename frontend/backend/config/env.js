import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  groqApiKey: process.env.GROQ_API_KEY,
  aqiApiKey: process.env.AQI_API_KEY,
  aqiApiUrl: process.env.AQI_API_URL || 'https://api.waqi.info/feed',
  mapboxApiKey: process.env.MAPBOX_API_KEY, 
};

const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing: ${varName}`);
    process.exit(1);
  }
});

if (!config.aqiApiKey) {
  console.warn(' Warning: AQI_API_KEY not set. AQI features will use fallback data.');
}

if (!config.mapboxApiKey) {
  console.warn('Warning: MAPBOX_API_KEY not set. Route finding will not work.');
}

if (!config.groqApiKey) {
  console.warn('Warning: GROQ_API_KEY not set. AI suggestions will use fallback.');
}

export default config;