import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`py-8 mt-auto ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4">
        {/* 品牌信息 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
            <i className="fa-solid fa-calculator text-blue-500 text-2xl mr-2"></i>
            <span className="font-bold text-xl">阳阳记账</span>
          </div>
          
          <div className="flex justify-center space-x-6">
            <Link to="/about" className={`hover:text-blue-500 transition-colors duration-200 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fa-solid fa-circle-info mr-1"></i> 关于我们
            </Link>
            <Link to="/privacy" className={`hover:text-blue-500 transition-colors duration-200 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fa-solid fa-shield-halved mr-1"></i> 隐私政策
            </Link>
            <Link to="/contact" className={`hover:text-blue-500 transition-colors duration-200 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fa-solid fa-envelope mr-1"></i> 联系我们
            </Link>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2025 阳阳记账 - 您的个人财务管理助手 | 版权所有
          </p>
        </div>
        
        {/* 社交媒体链接 - 仅在桌面显示 */}
        <div className="hidden md:flex justify-center mt-6 space-x-4">
          <a 
            href="#" 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="微博"
          >
            <i className="fa-brands fa-weibo text-red-500"></i>
          </a>
          <a 
            href="#" 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="微信"
          >
            <i className="fa-brands fa-weixin text-green-500"></i>
          </a>
          <a 
            href="#" 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="Github"
          >
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;