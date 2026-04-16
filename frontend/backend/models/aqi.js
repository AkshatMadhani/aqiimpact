import mongoose from 'mongoose';

const aqiLogSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true,
  },
  aqi: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Good', 'Moderate', 'Unhealthy for Sensitive', 'Unhealthy', 'Very Unhealthy', 'Hazardous'],
  },
  dominantPollutant: {
    type: String,
    enum: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO'],
  },
  pollutants: {
    pm25: Number,
    pm10: Number,
    o3: Number,
    no2: Number,
    so2: Number,
    co: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

aqiLogSchema.index({ city: 1, timestamp: -1 });

export default mongoose.model('AQILog', aqiLogSchema);