import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Heart, Save, Sparkles, Key, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import {useAuth} from '../context/AuthContext'
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, setUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    age: '',
    healthConditions: [],
    mapboxApiKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [showMapboxKey, setShowMapboxKey] = useState(false);

  const healthConditionsList = [
    { value: 'asthma', label: 'Asthma', icon: '🫁' },
    { value: 'copd', label: 'COPD', icon: '💨' },
    { value: 'heart_disease', label: 'Heart Disease', icon: '❤️' },
    { value: 'diabetes', label: 'Diabetes', icon: '🩸' },
    { value: 'hypertension', label: 'Hypertension', icon: '💓' },
    { value: 'bronchitis', label: 'Bronchitis', icon: '🫁' },
    { value: 'none', label: 'None', icon: '✅' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        city: user.city || '',
        age: user.age || '',
        healthConditions: user.healthConditions || [],
        mapboxApiKey: user.mapboxApiKey || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthConditionToggle = (condition) => {
    setFormData(prev => {
      if (condition === 'none') {
        return { ...prev, healthConditions: ['none'] };
      }
      const updated = prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions.filter(c => c !== 'none'), condition];
      return { ...prev, healthConditions: updated.length === 0 ? ['none'] : updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        name: formData.name,
        city: formData.city,
        age: parseInt(formData.age),
        healthConditions: formData.healthConditions,
        mapboxApiKey: formData.mapboxApiKey,
      };
      
      const { data } = await authAPI.updateProfile(updateData);
      if (setUser) setUser(data.data);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Please login first</h2>
          <Link to="/login" className="text-blue-600 underline mt-2 inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-300 rounded-full px-4 py-2 mb-4 border-2 border-gray-900"
          >
            <Sparkles className="w-4 h-4 text-gray-900" />
            <span className="text-gray-900 text-sm font-bold">PERSONALIZE YOUR EXPERIENCE</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Settings</h1>
          <p className="text-xl text-white/90">Update your profile and preferences</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-xl border-2 border-gray-900">
                  <User className="w-5 h-5 text-white" />
                </div>
                Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-gray-100 font-semibold cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Delhi, Mumbai"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-900 font-bold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-red-500 p-2 rounded-xl border-2 border-gray-900">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Health Conditions
              </h2>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 font-semibold">
                  ℹ️ Select any health conditions you have. This helps us provide personalized air quality recommendations.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {healthConditionsList.map((condition) => (
                  <motion.button
                    key={condition.value}
                    type="button"
                    onClick={() => handleHealthConditionToggle(condition.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      formData.healthConditions.includes(condition.value)
                        ? 'border-green-500 bg-green-500 text-white shadow-[2px_2px_0px_0px_#10b981]'
                        : 'border-gray-900 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{condition.icon}</div>
                    <div className="text-xs font-bold">{condition.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-xl border-2 border-gray-900">
                  <Key className="w-5 h-5 text-white" />
                </div>
                Mapbox API Key (Optional)
              </h2>
              
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 font-semibold">
                  🔑 Required for route finding feature. Get your free key from{' '}
                  <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Mapbox
                  </a>
                </p>
              </div>
              
              <div className="relative">
                <input
                  type={showMapboxKey ? 'text' : 'password'}
                  name="mapboxApiKey"
                  value={formData.mapboxApiKey}
                  onChange={handleChange}
                  placeholder="pk.eyJ1IjoieW91cnVzZXI..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowMapboxKey(!showMapboxKey)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showMapboxKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Settings;