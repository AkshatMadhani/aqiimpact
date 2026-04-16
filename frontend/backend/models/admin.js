import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  city: {
    type: String,
    required: true,
    index: true,
  },
  actionType: {
    type: String,
    enum: [
      'water_spray',
      'traffic_control',
      'construction_halt',
      'vehicle_restriction',
      'public_advisory',
      'other'
    ],
    required: true,
  },
  zone: String,
  description: {
    type: String,
    required: true,
  },
  aqiBeforeAction: {
    type: Number,
    required: true,
  },
  aqiAfterAction: Number,
  isSimulation: {
    type: Boolean,
    default: false,
  },
  estimatedImpact: {
    exposureReduction: Number,
    affectedPopulation: Number,
    durationMinutes: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

adminActionSchema.index({ city: 1, timestamp: -1 });

export default mongoose.model('AdminAction', adminActionSchema);
