import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Droplet, Car, Construction, AlertCircle, Wind, Sparkles, TrendingDown, MapPin, Clock, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { interventionAPI, aqiAPI } from '../services/api';

const CityActions = () => {
  const [city, setCity] = useState('Delhi');
  const [aqiData, setAqiData] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const actionTypes = [
    {
      value: 'water_spray',
      label: 'Water Spraying',
      icon: Droplet,
      color: '#3B82F6',
      bgColor: '#E8F4FF',
      description: 'Activate mist/water spray systems to suppress dust',
    },
    {
      value: 'traffic_control',
      label: 'Traffic Control',
      icon: Car,
      color: '#F59E0B',
      bgColor: '#FFF4E8',
      description: 'Implement traffic restrictions in high-pollution zones',
    },
    {
      value: 'construction_halt',
      label: 'Construction Halt',
      icon: Construction,
      color: '#EF4444',
      bgColor: '#FFE8E8',
      description: 'Temporarily halt construction activities',
    },
    {
      value: 'vehicle_restriction',
      label: 'Vehicle Restriction',
      icon: Car,
      color: '#A855F7',
      bgColor: '#F3E8FF',
      description: 'Implement odd-even or complete vehicle restrictions',
    },
  ];

  const [formData, setFormData] = useState({
    actionType: 'water_spray',
    zone: 'Zone A',
    description: '',
    durationMinutes: 60,
  });

  useEffect(() => {
    fetchAQI();
    fetchInterventions();
  }, [city]);

  const fetchAQI = async () => {
    try {
      const { data } = await aqiAPI.getCurrentAQI(city);
      setAqiData(data.data);
    } catch (error) {
      console.error('Failed to fetch AQI');
    }
  };

  const fetchInterventions = async () => {
    try {
      const { data } = await interventionAPI.getAll(city);
      setInterventions(data.data);
    } catch (error) {
      console.error('Failed to fetch interventions');
    }
  };

  const simulateIntervention = async () => {
    if (!formData.description) {
      toast.error('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      const { data } = await interventionAPI.simulate({
        ...formData,
        city,
        aqiBeforeAction: aqiData.aqi,
      });
      setSimulationResult(data.data);
      toast.success('Simulation completed!');
    } catch (error) {
      toast.error('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: '#10B981', label: 'Good' };
    if (aqi <= 100) return { bg: '#F59E0B', label: 'Moderate' };
    if (aqi <= 150) return { bg: '#EF4444', label: 'Unhealthy for Sensitive' };
    if (aqi <= 200) return { bg: '#DC2626', label: 'Unhealthy' };
    if (aqi <= 300) return { bg: '#7C3AED', label: 'Very Unhealthy' };
    return { bg: '#991B1B', label: 'Hazardous' };
  };

  const selectedAction = actionTypes.find(a => a.value === formData.actionType);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 right-10 opacity-20"
        >
          <Shield className="w-64 h-64 text-white" />
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
              <Sparkles className="w-4 h-4 text-gray-900" />
              <span className="text-gray-900 text-sm font-bold">AI-POWERED PREDICTIONS</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              City Intervention
              <div className="mt-2">Simulator
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block ml-3"
                >
                  🏙️
                </motion.span>
              </div>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Simulate city-level interventions and understand their potential impact on reducing air pollution exposure in real-time.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-12 bg-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(#111827 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: '0.05' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] -mt-20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-2xl border-2 border-gray-900">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Current Conditions</h3>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city name"
                />
              </div>

              {aqiData && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-6"
                >
                  <div 
                    className="rounded-2xl p-8 text-white text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] relative overflow-hidden"
                    style={{ backgroundColor: getAQIColor(aqiData.aqi).bg }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white rounded-2xl"
                    />
                    <div className="relative z-10">
                      <p className="text-sm opacity-90 font-bold uppercase tracking-wide mb-2">Current AQI</p>
                      <motion.p 
                        className="text-6xl font-black my-3"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {aqiData.aqi}
                      </motion.p>
                      <p className="text-lg font-bold">{aqiData.category}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 bg-gray-50 rounded-2xl p-4 border-2 border-gray-900">
                <div className="flex items-center gap-2 text-gray-700">
                  <Wind className="w-5 h-5" />
                  <span className="text-sm font-semibold">Live data from {city}</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl border-2 border-gray-900">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Simulate Intervention</h3>
              </div>

              {loading && <Loader message="Running simulation..." />}

              {!loading && (
                <>
                  <div className="mb-8">
                    <label className="block text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">Select Action Type</label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {actionTypes.map((action, index) => (
                        <motion.button
                          key={action.value}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({ ...formData, actionType: action.value })}
                          className={`p-6 rounded-2xl border-2 border-gray-900 text-left transition-all ${
                            formData.actionType === action.value
                              ? 'shadow-[4px_4px_0px_0px_#111827]'
                              : 'shadow-[2px_2px_0px_0px_#111827] hover:shadow-[4px_4px_0px_0px_#111827]'
                          }`}
                          style={{ 
                            backgroundColor: formData.actionType === action.value ? action.bgColor : 'white'
                          }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="p-2 rounded-xl border-2 border-gray-900"
                              style={{ backgroundColor: action.color }}
                            >
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-black text-gray-900">{action.label}</h4>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Zone</label>
                      <input
                        type="text"
                        value={formData.zone}
                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Zone A, Central District"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Duration (minutes)</label>
                      <input
                        type="number"
                        value={formData.durationMinutes}
                        onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wide">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      placeholder="Describe the intervention in detail..."
                    />
                  </div>

                  <motion.button
                    onClick={simulateIntervention}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Run Simulation
                    <Zap className="w-5 h-5" />
                  </motion.button>

                  {simulationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gray-900 p-8 rounded-3xl shadow-[4px_4px_0px_0px_#111827]"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-500 p-3 rounded-2xl border-2 border-gray-900">
                          <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-black text-2xl text-gray-900">Simulation Results</h4>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]">
                          <p className="text-sm text-gray-600 font-bold mb-2 uppercase tracking-wide">AQI Before</p>
                          <p className="text-5xl font-black text-red-500">{simulationResult.aqiBeforeAction}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]">
                          <p className="text-sm text-gray-600 font-bold mb-2 uppercase tracking-wide">AQI After (Estimated)</p>
                          <p className="text-5xl font-black text-green-500">{simulationResult.aqiAfterAction}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center bg-white rounded-xl p-4 border-2 border-gray-900">
                          <span className="text-gray-700 font-bold">Exposure Reduction:</span>
                          <span className="font-black text-purple-600 text-xl">{simulationResult.estimatedImpact.exposureReduction}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-xl p-4 border-2 border-gray-900">
                          <span className="text-gray-700 font-bold flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Affected Population:
                          </span>
                          <span className="font-black text-blue-600 text-xl">~{simulationResult.estimatedImpact.affectedPopulation.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-xl p-4 border-2 border-gray-900">
                          <span className="text-gray-700 font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Duration:
                          </span>
                          <span className="font-black text-gray-900 text-xl">{simulationResult.estimatedImpact.durationMinutes} min</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border-2 border-gray-900 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong className="font-black">Note:</strong> {simulationResult.notes}
                        </p>
                      </div>

                      <div className="bg-yellow-300 border-2 border-gray-900 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                          <p className="text-sm text-gray-900 font-semibold">{simulationResult.disclaimer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Interventions */}
      {interventions.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 border-b-2 border-gray-900">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-300 p-3 rounded-2xl border-2 border-gray-900">
                    <Activity className="w-8 h-8 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Recent Interventions</h3>
                    <p className="text-white/80">in {city}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                {interventions.slice(0, 5).map((intervention, index) => (
                  <motion.div
                    key={intervention._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-[4px_4px_0px_0px_#111827] transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-black text-gray-900 text-lg capitalize">
                          {intervention.actionType.replace('_', ' ')}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-gray-900 ${
                          intervention.isSimulation
                            ? 'bg-blue-300 text-gray-900'
                            : 'bg-green-300 text-gray-900'
                        }`}>
                          {intervention.isSimulation ? 'Simulation' : 'Actual'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2 font-semibold">
                        <Clock className="w-4 h-4" />
                        {new Date(intervention.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CityActions;