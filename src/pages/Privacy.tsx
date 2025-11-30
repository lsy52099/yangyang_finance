import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const Privacy: React.FC = () => {
  const { isDark } = useTheme();
  
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
          隐私政策
        </motion.h1>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
              阳阳记账非常重视用户隐私保护，我们致力于保护您的个人信息和数据安全。本隐私政策描述了我们如何收集、使用和保护您在使用我们的服务时提供的信息。请您在使用我们的服务前仔细阅读本政策。
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              更新日期：2025年1月1日
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-3">我们收集的信息</h2>
            <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc pl-5`}>
              <li>您的财务数据，包括收入、支出、预算等信息</li>
              <li>您自定义的分类和标签</li>
              <li>您的主题偏好设置</li>
              <li>浏览器信息和设备信息（仅用于优化用户体验）</li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-3">数据存储和安全</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              阳阳记账采用本地存储（LocalStorage）来保存您的所有数据。这意味着您的财务数据仅存储在您使用的设备上，不会上传到我们的服务器或任何第三方服务器。我们不会收集、存储或分享您的个人身份信息。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-3">数据访问权限</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              只有通过您的设备和浏览器才能访问存储在本地的数据。我们无法访问或查看您的个人财务数据。您可以随时通过清除浏览器数据或卸载应用来删除您的所有信息。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-3">第三方服务</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              阳阳记账可能会使用一些第三方服务来提供更好的用户体验，例如图标库和图表库。这些第三方服务可能会收集您的一些使用信息，但我们确保这些服务符合隐私保护标准，并且不会收集您的个人身份信息或财务数据。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold mb-3">隐私政策更新</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              我们可能会不时更新本隐私政策。当我们进行重大更改时，我们将通过应用内通知或其他适当方式通知您。继续使用我们的服务表示您接受更新后的隐私政策。
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-3">联系我们</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              如果您对我们的隐私政策有任何疑问或建议，请通过<a href="/contact" className="text-blue-500 hover:underline">联系我们</a>页面与我们取得联系。
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;