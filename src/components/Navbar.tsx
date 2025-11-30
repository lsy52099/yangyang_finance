import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 导航链接
  const navLinks = [
    { path: '/', label: '首页', icon: 'fa-home' },
    { path: '/records', label: '记录', icon: 'fa-list-alt' },
    { path: '/budget', label: '预算', icon: 'fa-chart-pie' },
    { path: '/categories', label: '分类', icon: 'fa-tags' },
  ];

  // 检查当前链接是否活跃
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 品牌标识 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <i className="fa-solid fa-calculator text-blue-500 text-2xl"></i>
              <span className="font-bold text-xl">阳阳记账</span>
            </Link>
          </div>

          {/* 桌面导航菜单 */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <i className={`fa-solid ${link.icon}`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="切换主题"
            >
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {/* 登录/注销按钮 */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              >
                <i className="fa-solid fa-sign-out-alt mr-1"></i> 注销
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
              >
                <i className="fa-solid fa-sign-in-alt mr-1"></i> 登录
              </Link>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
              aria-label="菜单"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActive(link.path)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={`fa-solid ${link.icon}`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* 移动端主题切换和登录/注销 */}
            <div className="flex justify-between px-4 pt-2">
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                <span>{isDark ? '切换到亮色' : '切换到暗色'}</span>
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  <i className="fa-solid fa-sign-out-alt mr-1"></i> 注销
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-sign-in-alt mr-1"></i> 登录
                </Link>
              )}
            </div>
             
             {/* 移动端版权信息 */}
             <div className="px-4 pt-4 border-t border-gray-700 dark:border-gray-700 mt-4">
               <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                 <p>© 2025 阳阳记账 - 您的个人财务管理助手</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;