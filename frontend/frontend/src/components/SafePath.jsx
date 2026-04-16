import { motion } from 'framer-motion';
import { MapPin, TrendingDown, TrendingUp, Award, Navigation } from 'lucide-react';

const RouteCompare = ({ data }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl border-2 border-gray-900">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Route Comparison</h3>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="bg-blue-500 p-3 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
        >
          <MapPin className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="bg-gradient-to-br from-green-400 to-green-600 border-2 border-gray-900 rounded-2xl p-6 mb-6 shadow-[4px_4px_0px_0px_#111827] relative overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-2xl"
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-yellow-300 p-3 rounded-xl border-2 border-gray-900">
            <Award className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <p className="text-sm text-white font-bold uppercase tracking-wider mb-1">
              🏆 Recommended Route
            </p>
            <p className="text-3xl font-black text-white">{data.bestRoute}</p>
          </div>
        </div>
      </motion.div>
      <div className="space-y-4">
        {data.comparison.map((route, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ x: 5 }}
            className={`p-6 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] ${
              route.routeName === data.bestRoute
                ? 'bg-gradient-to-br from-green-50 to-green-100'
                : 'bg-gradient-to-br from-gray-50 to-white'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-gray-900 text-xl">{route.routeName}</h4>
              {route.percentageDiff > 0 ? (
                <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl border-2 border-gray-900 font-black">
                  <TrendingUp className="w-5 h-5" />
                  <span>+{route.percentageDiff}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl border-2 border-gray-900 font-black">
                  <TrendingDown className="w-5 h-5" />
                  <span>Best</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-gray-900 mb-4">
              <p className="text-sm text-gray-600 font-bold mb-1 uppercase tracking-wide">Total Cost</p>
              <p className="text-4xl font-black text-gray-900">
                {route.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
                Zone Breakdown
              </p>
              {route.breakdown.map((zone, zIndex) => (
                <div 
                  key={zIndex} 
                  className="flex justify-between items-center p-3 bg-white rounded-xl border-2 border-gray-900"
                >
                  <span className="text-gray-700 font-bold">{zone.zone}</span>
                  <span className="text-gray-900 font-black text-sm">
                    AQI {zone.aqi} × {zone.timeMinutes}min = {zone.cost}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RouteCompare;