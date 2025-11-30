import React, { useState, useEffect } from 'react';
import StatisticsCard from '@/components/StatisticsCard';
import Charts from '@/components/Charts';
import TransactionForm from '@/components/TransactionForm';
import { useTransaction } from '@/contexts/transactionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const Home: React.FC = () => {
  const { isDark } = useTheme();
  const { getRecentTransactions } = useTransaction();
  const [showAddForm, setShowAddForm] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  // 欢迎消息
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    
    if (hour < 6) return '夜深了，早点休息';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了，注意身体';
  };
  
  // 获取最近的交易记录
  useEffect(() => {
    // 模拟获取最近交易的函数调用
    // 在实际应用中应从TransactionContext中获取
    const mockRecentTransactions = [
      {
        id: 'tx-1',
        amount: 85.50,
        type: 'expense',
        category: '餐饮',
        categoryIcon: 'fa-utensils',
        categoryColor: '#EF4444',
        date: new Date(),
        description: '午餐',
        tags: ['日常开销', '午餐']
      },
      {
        id: 'tx-2',
        amount: 12000.00,
        type: 'income',
        category: '工资',
        categoryIcon: 'fa-money-bill-wave',
        categoryColor: '#10B981',
        date: new Date(Date.now() - 86400000),
        description: '月工资'
      },
      {
        id: 'tx-3',
        amount: 150.00,
        type: 'expense',
        category: '交通',
        categoryIcon: 'fa-car',
        categoryColor: '#F59E0B',
        date: new Date(Date.now() - 172800000),
        description: '加油费',
        tags: ['交通', '汽车']
      }
    ];
    
    setRecentTransactions(mockRecentTransactions);
  }, []);
  
  // 格式化日期
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
      });
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* 顶部横幅 */}
      <motion.div 
        className={`rounded-2xl overflow-hidden mb-8 shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-white'}`}>
                欢迎回来，阳阳
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-white/90'}`}>
                {getWelcomeMessage()}，今天也要好好记账哦！
              </p>{/* 本月财务概览 */}
              <div className={`mt-6 p-4 rounded-xl ${
                isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                <h3 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-white/90'}`}>
                  本月财务概览
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>收入</p>
                    <p className="text-xl font-bold text-green-400">¥12,850.00</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>支出</p>
                    <p className="text-xl font-bold text-red-400">¥4,230.75</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>结余</p>
                    <p className="text-xl font-bold text-white">¥8,619.25</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 快速添加按钮 */}
            <motion.button
              onClick={() => setShowAddForm(true)}
              className={`mt-6 md:mt-0 px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 ${
                isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white hover:bg-gray-100 text-blue-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fa-solid fa-plus-circle text-xl ${isDark ? 'text-white' : 'text-blue-600'}`}></i>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-blue-600'}`}>添加新交易</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticsCard title="总余额" icon="fa-wallet" type="balance" color="#3B82F6" />
        <StatisticsCard title="总收入" icon="fa-plus-circle" type="income" color="#10B981" />
        <StatisticsCard title="总支出" icon="fa-minus-circle" type="expense" color="#EF4444" />
      </div>
      
      {/* 图表和最近交易 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 左侧两个图表 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Charts type="expenseByCategory" title="支出分类占比" />
          <Charts type="trend" title="收支趋势" />
          <Charts type="balanceTrend" title="余额趋势" />
          <Charts type="categoryRadar" title="分类支出雷达图" />
        </div>
        
        {/* 右侧最近交易 */}
        <motion.div 
          className={`rounded-xl shadow-md p-6 transition-all duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <i className="fa-solid fa-history text-blue-500 mr-2"></i>
              最近交易
            </h3>
            <button 
              className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              onClick={() => {
                window.location.href = '/records';
              }}
            >
              查看全部
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                } transition-all duration-200`}
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: transaction.categoryColor }}
                    >
                      <i className={`fa-solid ${transaction.categoryIcon} text-white`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.category}</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {transaction.description} · {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* 没有交易记录的情况 */}
          {recentTransactions.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
              </div>
              <p className="text-lg font-medium">暂无交易记录</p>
              <p className="text-sm mt-1">添加您的第一笔交易</p>
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fa-solid fa-plus mr-1"></i> 添加交易
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* 月度预算进度 */}
      <motion.div 
        className={`rounded-xl shadow-md p-6 transition-all duration-300 mb-8 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <i className="fa-solid fa-chart-pie text-purple-500 mr-2"></i>
            月度预算进度
          </h3>
          <button 
            className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            onClick={() => {
              window.location.href = '/budget';
            }}
          >
            管理预算
          </button>
        </div>
        
        <div className="space-y-4">
          {/* 预算项目示例 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <i className="fa-solid fa-utensils text-red-500 mr-2"></i>
                <span>餐饮</span>
              </div>
              <span className="text-sm">¥1,250 / ¥2,000 (62.5%)</span>
            </div>
            <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full rounded-full bg-red-500"
                initial={{ width: '0%' }}
                animate={{ width: '62.5%' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <i className="fa-solid fa-car text-amber-500 mr-2"></i>
                <span>交通</span>
              </div>
              <span className="text-sm">¥650 / ¥1,000 (65%)</span>
            </div>
            <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full rounded-full bg-amber-500"
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <i className="fa-solid fa-shopping-cart text-purple-500 mr-2"></i>
                <span>购物</span>
              </div>
              <span className="text-sm">¥890 / ¥1,500 (59.3%)</span>
            </div>
            <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <motion.div
                className="h-full rounded-full bg-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: '59.3%' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 添加交易表单模态框 */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <TransactionForm
                onClose={() => setShowAddForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;