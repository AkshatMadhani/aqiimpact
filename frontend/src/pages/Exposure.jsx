import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MapPin, Clock, Activity, Sparkles, TrendingUp, Heart, Wind, Zap, ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Loader from '../components/Loader';
import AQICard from '../components/AQIcard';
import ExposureResult from '../components/Result';
import { aqiAPI, exposureAPI } from '../services/api';

const Exposure = () => {
  const [formData, setFormData] = useState({
    city: 'Delhi',
    timeMinutes: 30,
    activity: 'walking',
  });
  const [aqiData, setAqiData] = useState(null);
  const [exposureResult, setExposureResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const activities = [
    { value: 'resting', label: 'Resting', icon: '🧘', color: '#3B82F6', breathingRate: 'Low' },
    { value: 'walking', label: 'Walking', icon: '🚶', color: '#10B981', breathingRate: 'Moderate' },
    { value: 'cycling', label: 'Cycling', icon: '🚴', color: '#F59E0B', breathingRate: 'High' },
    { value: 'running', label: 'Running', icon: '🏃', color: '#EF4444', breathingRate: 'Very High' },
    { value: 'commuting', label: 'Commuting', icon: '🚗', color: '#A855F7', breathingRate: 'Low' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAQI = async () => {
    if (!formData.city) {
      toast.error('Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      const { data } = await aqiAPI.getCurrentAQI(formData.city);
      setAqiData(data.data);
      setStep(2);
      toast.success(`AQI data fetched for ${formData.city}`);
    } catch (error) {
      toast.error('Failed to fetch AQI data');
    } finally {
      setLoading(false);
    }
  };

  const calculateExposure = async () => {
    if (!formData.timeMinutes || !formData.activity) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await exposureAPI.calculate({
        city: formData.city,
        timeMinutes: parseInt(formData.timeMinutes),
        activity: formData.activity,
      });
      setExposureResult(data.data);
      setStep(3);
      toast.success('Exposure calculated successfully');
    } catch (error) {
      toast.error('Failed to calculate exposure');
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setFormData({ city: 'Delhi', timeMinutes: 30, activity: 'walking' });
    setAqiData(null);
    setExposureResult(null);
    setStep(1);
  };

  const selectedActivity = activities.find(a => a.value === formData.activity);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 left-10 opacity-20"
        >
          <Calculator className="w-64 h-64 text-white" />
        </motion.div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-yellow-300 rounded-full px-4 py-2 mb-6 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-900 text-sm font-bold">PERSONALIZED FOR YOU</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Personal Exposure
              <div className="mt-2">Calculator
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block ml-3"
                >
                  🌬️
                </motion.span>
              </div>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Calculate your personalized air pollution exposure based on your activity, duration, and current air quality conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex justify-center -mt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
            >
              {[
                { num: 1, label: 'Location', icon: MapPin },
                { num: 2, label: 'Activity', icon: Activity },
                { num: 3, label: 'Results', icon: TrendingUp }
              ].map(({ num, label, icon: Icon }, index) => (
                <div key={num} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: step === num ? 1.1 : 1,
                    }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 border-gray-900 flex items-center justify-center font-black text-xl transition-all ${
                        step >= num 
                          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[2px_2px_0px_0px_#111827]' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step > num ? '✓' : <Icon className="w-8 h-8" />}
                    </div>
                    <span className={`text-xs font-bold mt-2 uppercase tracking-wide ${step >= num ? 'text-gray-900' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </motion.div>
                  {index < 2 && (
                    <div className="mx-4 flex items-center">
                      <ChevronRight className={`w-6 h-6 ${step > num ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {loading && <Loader message="Processing..." />}

      {!loading && (
        <section className="py-12 bg-white relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(#111827 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: '0.05' }} />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input Form */}
              <div>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-500 p-3 rounded-2xl border-2 border-gray-900">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Select Location</h3>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">City Name</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="e.g., Delhi, Mumbai, Bangalore"
                      />
                    </div>

                    <motion.button
                      onClick={fetchAQI}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg flex items-center justify-center gap-2"
                    >
                      <Wind className="w-5 h-5" />
                      Fetch Current AQI
                      <Sparkles className="w-5 h-5" />
                    </motion.button>

                    <div className="mt-6 bg-blue-50 rounded-2xl p-5 border-2 border-gray-900">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-300 p-2 rounded-xl border-2 border-gray-900 flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 mb-1">Smart Tip</p>
                          <p className="text-sm text-gray-700">We'll fetch real-time air quality data for your selected city using multiple trusted sources.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-500 p-3 rounded-2xl border-2 border-gray-900">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Activity Details</h3>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Duration (minutes)</label>
                      <input
                        type="number"
                        name="timeMinutes"
                        value={formData.timeMinutes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                        placeholder="30"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">
                        Activity Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {activities.map((act, index) => (
                          <motion.button
                            key={act.value}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, activity: act.value })}
                            className={`p-5 rounded-2xl border-2 border-gray-900 transition-all ${
                              formData.activity === act.value
                                ? 'shadow-[4px_4px_0px_0px_#111827]'
                                : 'shadow-[2px_2px_0px_0px_#111827] hover:shadow-[4px_4px_0px_0px_#111827]'
                            }`}
                            style={{ 
                              backgroundColor: formData.activity === act.value ? act.color : 'white'
                            }}
                          >
                            <div className="text-4xl mb-2">{act.icon}</div>
                            <div className={`font-black text-sm ${formData.activity === act.value ? 'text-white' : 'text-gray-900'}`}>
                              {act.label}
                            </div>
                            <div className={`text-xs mt-1 ${formData.activity === act.value ? 'text-white/80' : 'text-gray-600'}`}>
                              {act.breathingRate}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setStep(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-4 rounded-2xl border-2 border-gray-900 font-bold bg-white shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={calculateExposure}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-2"
                      >
                        <Calculator className="w-5 h-5" />
                        Calculate Exposure
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-purple-500 p-3 rounded-2xl border-2 border-gray-900">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Your Calculation</h3>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border-2 border-gray-900">
                        <span className="text-gray-600 font-bold flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          City:
                        </span>
                        <span className="font-black text-gray-900 text-lg">{formData.city}</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border-2 border-gray-900">
                        <span className="text-gray-600 font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Duration:
                        </span>
                        <span className="font-black text-gray-900 text-lg">{formData.timeMinutes} min</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border-2 border-gray-900">
                        <span className="text-gray-600 font-bold flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Activity:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedActivity?.icon}</span>
                          <span className="font-black text-gray-900 text-lg capitalize">{formData.activity}</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={resetCalculator}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Calculate Again
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="space-y-8">
                {aqiData && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <AQICard data={aqiData} />
                  </motion.div>
                )}
                {exposureResult && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ExposureResult data={exposureResult} />
                  </motion.div>
                )}
                
                {!aqiData && !exposureResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] text-center"
                  >
                    <div className="bg-gray-100 w-24 h-24 rounded-3xl border-2 border-gray-900 flex items-center justify-center mx-auto mb-6">
                      <Calculator className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">Ready to Calculate?</h4>
                    <p className="text-gray-600 font-semibold">Complete the steps to see your personalized results here</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Exposure;