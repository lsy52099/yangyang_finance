import React, { useState, useEffect } from 'react';
import StatisticsCard from '@/components/StatisticsCard';
import Charts from '@/components/Charts';
import TransactionForm from '@/components/TransactionForm';
import { useTransaction } from '@/contexts/transactionContext';
import { useBudget } from '@/contexts/budgetContext';
import { useCategory } from '@/contexts/categoryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const { isDark } = useTheme();
  const { transactions, getTransactionsByDateRange } = useTransaction();
  const { budgets, calculateBudgetSpent } = useBudget();
  const { getCategoryById } = useCategory();
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
    const transactions = getTransactionsByDateRange(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
    const recentTransactionsData = transactions.slice(0, 3).map(transaction => {
      const category = getCategoryById(transaction.categoryId);
      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        category: category?.name || '未知分类',
        categoryIcon: category?.icon || 'fa-tag',
        categoryColor: category?.color || '#6B7280',
        date: transaction.date,
        description: transaction.description,
        tags: transaction.tags
      };
    });
    
    setRecentTransactions(recentTransactionsData);
  }, [transactions, getTransactionsByDateRange, getCategoryById]);

  // 通知与提醒
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (!savedSettings) return;
      const s = JSON.parse(savedSettings);
      if (!s.notificationsEnabled) return;
      // 预算超支提醒
      if (s.budgetOverspendAlert) {
        const overs = budgets.filter((b: any) => {
          const spent = calculateBudgetSpent(b.id);
          return b.amount > 0 && (spent / b.amount) >= 0.8;
        });
        if (overs.length > 0) {
          toast.warning('有预算接近或超过80%，请及时调整');
        }
      }
      // 月度报告（每月1日提示）
      if (s.monthlyReportEnabled) {
        const today = new Date();
        if (today.getDate() === 1) {
          toast.info('月度财务报告已生成，前往统计查看');
        }
      }
    } catch {}
  }, [budgets]);
  
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>收入</p>
                    <p className="text-lg sm:text-xl font-bold text-green-400 break-words">¥12,850.00</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>支出</p>
                    <p className="text-lg sm:text-xl font-bold text-red-400 break-words">¥4,230.75</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/80'}`}>结余</p>
                    <p className="text-lg sm:text-xl font-bold text-white break-words">¥8,619.25</p>
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
          {/* 真实预算数据 */}
          {budgets.slice(0, 3).map((budget) => {
            const category = getCategoryById(budget.categoryId);
            const spent = calculateBudgetSpent(budget.id);
            const progress = Math.min((spent / budget.amount) * 100, 100);
            const getProgressColor = () => {
              if (progress < 70) return 'bg-green-500';
              if (progress < 90) return 'bg-yellow-500';
              return 'bg-red-500';
            };
            
            return (
              <div key={budget.id}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {category && (
                      <>
                        <i className={`fa-solid ${category.icon} mr-2`} style={{ color: category.color }}></i>
                        <span>{category.name}</span>
                      </>
                    )}
                  </div>
                  <span className="text-sm">¥{spent.toFixed(2)} / ¥{budget.amount.toFixed(2)} ({progress.toFixed(1)}%)</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                  <motion.div
                    className={`h-full rounded-full ${getProgressColor()}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <div className="text-center py-4">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                还没有设置预算，前往预算页面设置
              </p>
            </div>
          )}
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
