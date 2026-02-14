import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black py-3 px-6 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-x-[2px] hover:translate-y-[2px] transition-all',
    secondary: 'bg-white text-gray-900 font-black py-3 px-6 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-x-[2px] hover:translate-y-[2px] transition-all',
    danger: 'bg-red-500 text-white font-black py-3 px-6 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-x-[2px] hover:translate-y-[2px] transition-all',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${variants[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};

export default Button;