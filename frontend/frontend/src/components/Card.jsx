import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;