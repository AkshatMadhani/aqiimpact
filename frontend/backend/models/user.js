import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
  },
  ageGroup: {
    type: String,
    enum: ['child', 'adult', 'senior'],
    default: 'adult',
  },
  healthConditions: [{
    type: String,
    enum: ['asthma', 'copd', 'heart_disease', 'diabetes', 'hypertension', 'bronchitis', 'emphysema', 'none'],
  }],
  preExistingDiseases: [{
    type: String,
    enum: ['asthma', 'copd', 'heart_disease', 'diabetes', 'hypertension', 'bronchitis', 'emphysema', 'none'],
  }],
  city: {
    type: String,
    default: 'Delhi',
  },
  alertThreshold: {
    type: Number,
    default: 200,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
 
  mapboxApiKey: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', function () {
  if (this.age) {
    if (this.age < 18) this.ageGroup = 'child';
    else if (this.age >= 65) this.ageGroup = 'senior';
    else this.ageGroup = 'adult';
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;