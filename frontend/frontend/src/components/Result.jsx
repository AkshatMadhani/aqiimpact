import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Sparkles, TrendingUp } from 'lucide-react';

const getRiskIcon = (level) => {
  if (level === 'LOW' || level === 'MODERATE') return CheckCircle;
  if (level === 'HIGH') return AlertCircle;
  return XCircle;
};

const getRiskColor = (level) => {
  const colors = {
    LOW: '#10B981',
    MODERATE: '#F59E0B',
    HIGH: '#EF4444',
    VERY_HIGH: '#DC2626',
    HAZARDOUS: '#7C3AED',
  };
  return colors[level] || '#6B7280';
};

const ExposureResult = ({ data }) => {
  if (!data) return null;

  const Icon = getRiskIcon(data.riskLevel);
  const riskColor = getRiskColor(data.riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl border-2 border-gray-900">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Your Exposure</h3>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-2xl border-2 border-gray-900"
          style={{ backgroundColor: riskColor }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      <div 
        className="rounded-2xl p-8 text-white mb-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] relative overflow-hidden"
        style={{ backgroundColor: riskColor }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-2xl"
        />
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wider opacity-90">Exposure Score</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl font-black mt-2"
          >
            {data.exposureScore.toLocaleString()}
          </motion.p>
          <p className="text-sm mt-2 font-bold opacity-90">Risk Level: {data.riskLevel}</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-gray-900">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-xl border-2 border-gray-900 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-900 font-semibold">{data.explanation}</p>
        </div>
      </div>
      {data.breakdown && (
        <div className="mb-6">
          <h4 className="font-black text-gray-900 mb-4 text-lg uppercase tracking-wide">Calculation Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(data.breakdown).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-900"
              >
                <span className="text-gray-700 font-bold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-black text-gray-900 text-lg">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {data.suggestions && data.suggestions.length > 0 && (
        <div>
          <h4 className="font-black text-gray-900 mb-4 text-lg uppercase tracking-wide">AI Recommendations</h4>
          <ul className="space-y-3">
            {data.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
              >
                <div className="bg-green-500 p-1.5 rounded-lg border-2 border-gray-900 flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 font-semibold">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ExposureResult;