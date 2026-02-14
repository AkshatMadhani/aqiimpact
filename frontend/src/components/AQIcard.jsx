import { motion } from 'framer-motion';
import { Wind, Droplet, AlertTriangle, MapPin, Clock, Activity } from 'lucide-react';

const getAQIInfo = (aqi) => {
  if (aqi <= 50) return { bg: '#10B981', label: 'Good', emoji: '😊' };
  if (aqi <= 100) return { bg: '#F59E0B', label: 'Moderate', emoji: '😐' };
  if (aqi <= 150) return { bg: '#EF4444', label: 'Unhealthy for Sensitive', emoji: '😷' };
  if (aqi <= 200) return { bg: '#DC2626', label: 'Unhealthy', emoji: '😨' };
  if (aqi <= 300) return { bg: '#7C3AED', label: 'Very Unhealthy', emoji: '😰' };
  return { bg: '#991B1B', label: 'Hazardous', emoji: '☠️' };
};

const AQICard = ({ data }) => {
  if (!data) return null;

  const aqiInfo = getAQIInfo(data.aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-2xl font-black text-gray-900">{data.city}</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <p className="text-sm font-semibold">{new Date(data.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
        >
          <Wind className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="relative mb-8"
      >
        <div 
          className="rounded-3xl w-48 h-48 mx-auto flex flex-col items-center justify-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] relative overflow-hidden"
          style={{ backgroundColor: aqiInfo.bg }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-3xl"
          />
          <div className="text-center relative z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-black text-white mb-2"
            >
              {data.aqi}
            </motion.div>
            <p className="text-white text-lg font-bold uppercase tracking-wider">AQI</p>
          </div>
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
        >
          <span className="text-3xl">{aqiInfo.emoji}</span>
          <div className="text-left">
            <h4 className="text-xl font-black text-gray-900">{aqiInfo.label}</h4>
            <p className="text-sm text-gray-600 font-semibold">Dominant: {data.dominantPollutant}</p>
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h5 className="font-black text-gray-900 uppercase text-sm tracking-wide">Pollutant Levels</h5>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(data.pollutants).map(([key, value], index) => {
            if (!value) return null;
            const colors = [
              { bg: '#E8F4FF', border: '#3B82F6', text: '#1E40AF' },
              { bg: '#FFE8EC', border: '#EF4444', text: '#991B1B' },
              { bg: '#E8FFE8', border: '#10B981', text: '#065F46' },
              { bg: '#FFF4E8', border: '#F59E0B', text: '#92400E' },
              { bg: '#F3E8FF', border: '#A855F7', text: '#6B21A8' },
              { bg: '#E8FFFE', border: '#14B8A6', text: '#134E4A' },
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-2xl p-4 text-center border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
                style={{ backgroundColor: colorScheme.bg }}
              >
                <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: colorScheme.text }}>
                  {key}
                </p>
                <p className="text-2xl font-black" style={{ color: colorScheme.text }}>
                  {value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {data.aqi > 150 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-500 border-2 border-gray-900 p-5 rounded-2xl shadow-[2px_2px_0px_0px_#111827]"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="bg-yellow-300 p-2 rounded-xl border-2 border-gray-900 flex-shrink-0"
            >
              <AlertTriangle className="w-6 h-6 text-gray-900" />
            </motion.div>
            <div>
              <p className="text-white font-black text-sm mb-1">⚠️ HEALTH ALERT</p>
              <p className="text-white font-semibold text-sm">
                Unhealthy air quality detected. Limit outdoor exposure and wear protective masks.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AQICard;