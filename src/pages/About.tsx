import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const About: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`rounded-xl shadow-md p-8 mb-8 transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          关于阳阳记账
        </motion.h1>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-3">应用简介</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              阳阳记账是一款专注于个人财务管理的Web应用，旨在帮助用户轻松记录、分析和管理个人收支情况。通过简洁直观的界面和丰富的功能，让您的财务管理变得更加简单高效。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-3">主要功能</h2>
            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>快速记录收入和支出交易</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>多维度数据统计和可视化图表</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>个性化预算设置和跟踪</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>自定义收支分类</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>支持明暗主题切换</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>数据本地存储，安全可靠</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-3">版本信息</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              当前版本：v1.0.0
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-3">版权声明</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              © 2025 阳阳记账 版权所有。保留所有权利。未经授权，不得以任何形式复制、传播或使用本应用的任何部分。
            </p>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className={`rounded-xl shadow-md p-8 transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">团队介绍</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
              <i className="fa-solid fa-user text-blue-500 text-2xl"></i>
            </div>
            <h3 className="font-medium">开发团队</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>专注于提供优质的用户体验</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
              <i className="fa-solid fa-paint-brush text-green-500 text-2xl"></i>
            </div>
            <h3 className="font-medium">设计团队</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>创造美观实用的界面设计</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
              <i className="fa-solid fa-headset text-purple-500 text-2xl"></i>
            </div>
            <h3 className="font-medium">支持团队</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>为用户提供贴心的帮助与支持</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;