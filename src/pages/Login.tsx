import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const Login: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // 登录/注册
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !password) {
      toast.error('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const usersRaw = localStorage.getItem('users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        if (isRegisterMode) {
          const exists = users.some((u: any) => u.username === username);
          if (exists) {
            toast.error('用户名已存在，请更换');
          } else {
            const newUser = { username, password }; // 简化存储
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            toast.success('注册成功，请登录');
            setIsRegisterMode(false);
          }
        } else {
          const found = users.find((u: any) => u.username === username && u.password === password);
          if (found || (username === 'admin' && password === 'password')) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', username);
            toast.success('登录成功，欢迎回来！');
            navigate('/');
          } else {
            toast.error('用户名或密码错误，请重试');
          }
        }
      } catch (err) {
        toast.error('操作失败，请重试');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };
  
  // 自动填充测试账号
  const fillTestCredentials = () => {
    setUsername('admin');
    setPassword('password');
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* 顶部装饰 */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform -skew-y-6 origin-top-left"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70"></div>
        
        {/* 浮动图形装饰 */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10"
          animate={{ 
            y: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-white opacity-10"
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-12 h-12 rounded-full bg-white opacity-10"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* 登录卡片 */}
      <div className="flex-grow flex items-center justify-center -mt-32 px-4">
        <motion.div
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'} relative z-10`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-calculator text-white text-3xl"></i>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              阳阳记账
            </motion.h1>
            <motion.p 
              className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              登录您的账号，开始财务管理之旅
            </motion.p>
          </div>
          
          <form onSubmit={handleLogin}>
            {/* 用户名输入 */}
            <div className="mb-5">
              <label 
                htmlFor="username" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                用户名
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <i className="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                      : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  autoFocus
                />
              </div>
            </div>
            
            {/* 密码输入 */}
            <div className="mb-7">
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                密码
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                      : 'border-gray-300 bg-white text-gray-800 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
            </div>
            
            {/* 提交按钮 */}
            <motion.button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <i className={isRegisterMode ? 'fa-solid fa-user-plus' : 'fa-solid fa-right-to-bracket'}></i>
              )}
              <span className="font-medium">
                {isLoading ? (isRegisterMode ? '注册中...' : '登录中...') : (isRegisterMode ? '注册' : '登录')}
              </span>
            </motion.button>
            
            {/* 快速登录提示 */}
            <motion.button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className={`mt-4 w-full py-2.5 rounded-lg ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200 text-sm`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <i className={isRegisterMode ? 'fa-solid fa-right-to-bracket mr-2' : 'fa-solid fa-user-plus mr-2'}></i>
              {isRegisterMode ? '切换到登录' : '切换到注册'}
            </motion.button>
            <motion.button
              type="button"
              onClick={fillTestCredentials}
              className={`mt-2 w-full py-2.5 rounded-lg ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200 text-sm`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <i className="fa-solid fa-magic mr-2"></i>
              自动填充测试账号
            </motion.button>
          </form>
          
           {/* 装饰元素 */}
           <motion.div 
             className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.6 }}
           >
             <p>登录后即可开始使用阳阳记账</p>
             <p className="mt-1">测试账号：admin / password</p>
           </motion.div>
        </motion.div>
      </div>
      
      {/* 底部装饰 */}
      <div className="h-24 md:h-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform skew-y-6 origin-top-right"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70"></div>
      </div>
    </div>
  );
};

export default Login;
