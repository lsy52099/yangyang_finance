import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-3 rounded-full shadow-md transition-all duration-300 ${
        isDark ? 'bg-gray-700 text-yellow-300' : 'bg-blue-50 text-blue-600'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`切换到${isDark ? '亮色' : '暗色'}模式`}
    >
      <motion.i
        className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-xl`}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;