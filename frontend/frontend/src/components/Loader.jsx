import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]"
      >
        <Wind className="w-16 h-16 text-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-900 font-black"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default Loader;