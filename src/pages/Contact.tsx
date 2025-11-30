import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!name || !email || !message) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟表单提交
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('感谢您的留言，我们会尽快回复！');
      
      // 重置表单
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };
  
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`rounded-xl shadow-md p-8 transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          联系我们
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">联系信息</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <i className="fa-solid fa-envelope text-blue-500"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">电子邮件</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    对于一般问题和反馈
                  </p>
                  <a 
                    href="mailto:support@yangyang记账.com" 
                    className="text-blue-500 hover:underline"
                  >
                    support@yangyang记账.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <i className="fa-solid fa-code text-purple-500"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">技术支持</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    对于应用问题和技术咨询
                  </p>
                  <a 
                    href="mailto:tech@yangyang记账.com" 
                    className="text-blue-500 hover:underline"
                  >
                    tech@yangyang记账.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isDark ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <i className="fa-solid fa-comment-dots text-green-500"></i>
                </div>
                <div>
                  <h3 className="font-medium mb-1">社交媒体</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    在社交媒体上关注我们获取最新动态
                  </p>
                  <div className="flex space-x-4">
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
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">发送消息</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  姓名 *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  required
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  邮箱 *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱地址"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  required
                />
              </div>
              
              <div>
                <label 
                  htmlFor="message" 
                  className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  消息内容 *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="请输入您的留言内容..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none`}
                  required
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-paper-plane"></i>
                )}
                <span className="font-medium">
                  {isSubmitting ? '发送中...' : '发送消息'}
                </span>
              </motion.button>
              
              <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                * 表示必填字段
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;