import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Calendar, Eye, EyeOff, AlertCircle, Sparkles, UserPlus, Wind, Shield, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    age: '',
    preExistingDiseases: [],
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const healthConditions = [
    { value: 'asthma', label: 'Asthma', icon: '🫁' },
    { value: 'copd', label: 'COPD', icon: '💨' },
    { value: 'heart_disease', label: 'Heart Disease', icon: '❤️' },
    { value: 'diabetes', label: 'Diabetes', icon: '🩸' },
    { value: 'hypertension', label: 'Hypertension', icon: '💓' },
    { value: 'bronchitis', label: 'Bronchitis', icon: '🫁' },
    { value: 'none', label: 'None', icon: '✅' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleHealthConditionToggle = (condition) => {
    if (condition === 'none') {
      setFormData({
        ...formData,
        preExistingDiseases: ['none'],
      });
    } else {
      const updated = formData.preExistingDiseases.includes(condition)
        ? formData.preExistingDiseases.filter(c => c !== condition)
        : [...formData.preExistingDiseases.filter(c => c !== 'none'), condition];
      
      setFormData({
        ...formData,
        preExistingDiseases: updated.length === 0 ? ['none'] : updated,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await registerUser(registerData);
      
      if (success) {
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 right-10 opacity-10"
      >
        <Shield className="w-96 h-96 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative z-10"
      >
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[8px_8px_0px_0px_#111827]">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]">
                <UserPlus className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-gray-900 mb-2"
            >
              Join AirImpact ✨
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-yellow-300 rounded-full px-4 py-2 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
              <span className="text-gray-900 text-sm font-bold">Create your free account</span>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <User className={`w-5 h-5 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                </div>
                {errors.name && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Mail className={`w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <MapPin className={`w-5 h-5 ${errors.city ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.city 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                </div>
                {errors.city && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.city}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className={`w-5 h-5 ${errors.age ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.age 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                </div>
                {errors.age && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.age}
                  </motion.div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Pre-existing Health Conditions
              </label>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-700 font-semibold">
                  ℹ️ Help us personalize your air quality recommendations by selecting any health conditions you have.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthConditions.map((condition) => (
                  <motion.button
                    key={condition.value}
                    type="button"
                    onClick={() => handleHealthConditionToggle(condition.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.preExistingDiseases.includes(condition.value)
                        ? 'border-green-500 bg-green-500 text-white shadow-[2px_2px_0px_0px_#10b981]'
                        : 'border-gray-900 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{condition.icon}</div>
                    <div className="text-xs font-bold">{condition.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock className={`w-5 h-5 ${errors.confirmPassword ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 font-semibold focus:outline-none transition-all ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-gray-900 focus:ring-2 focus:ring-green-500'
                    }`}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                {errors.confirmPassword && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mt-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </motion.div>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-center">
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-900">
              <p className="text-gray-700 font-semibold">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 font-black hover:text-green-700 underline decoration-2 underline-offset-2">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;