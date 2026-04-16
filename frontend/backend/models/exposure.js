import mongoose from 'mongoose';

const exposureHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  exposureScore: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH', 'HAZARDOUS'],
    required: true,
  },
  aqi: {
    type: Number,
    required: true,
  },
  activity: {
    type: String,
    enum: ['resting', 'walking', 'cycling', 'running', 'commuting'],
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  city: String,
  zone: String,
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

exposureHistorySchema.index({ userId: 1, date: -1 });

export default mongoose.model('ExposureHistory', exposureHistorySchema);