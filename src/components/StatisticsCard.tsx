import React, { useState, useEffect } from 'react';
import { useTransaction } from '@/contexts/transactionContext';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// 时间段选项
type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface StatisticsCardProps {
  title: string;
  icon: string;
  type: 'balance' | 'income' | 'expense';
  color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, icon, type, color }) => {
  const { getTransactionsByDateRange, getTotalIncome, getTotalExpense, getBalance } = useTransaction();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [amount, setAmount] = useState<number>(0);
  const [formattedAmount, setFormattedAmount] = useState<string>('¥0.00');
  const { isDark } = useTheme();
  
  // 计算指定时间段内的交易数据
  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timePeriod) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const transactions = getTransactionsByDateRange(startDate, now);
    
    let calculatedAmount = 0;
    switch (type) {
      case 'balance':
        calculatedAmount = getBalance(transactions);
        break;
      case 'income':
        calculatedAmount = getTotalIncome(transactions);
        break;
      case 'expense':
        calculatedAmount = getTotalExpense(transactions);
        break;
    }
    
    setAmount(calculatedAmount);
    
    // 格式化金额
    const formatted = new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(calculatedAmount);
    
    setFormattedAmount(formatted);
  }, [timePeriod, getTransactionsByDateRange, getTotalIncome, getTotalExpense, getBalance, type]);
  
  // 时间段选项
  const periodOptions: { value: TimePeriod; label: string }[] = [
    { value: 'today', label: '今日' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'year', label: '本年' },
  ];
  
  // 获取金额颜色
  const getAmountColor = () => {
    if (type === 'income') return 'text-green-500';
    if (type === 'expense') return 'text-red-500';
    
    // 对于余额，根据正负显示不同颜色
    return amount >= 0 ? 'text-green-500' : 'text-red-500';
  };
  
  // 获取图标背景渐变
  const getIconBackground = () => {
    const baseColor = color.replace('#', '');
    return `linear-gradient(135deg, #${baseColor}, #${baseColor}99)`;
  };
  
  // 计算金额变化趋势
  const calculateTrend = () => {
    const now = new Date();
    let currentStart: Date;
    let previousStart: Date;
    let previousEnd: Date;
    
    // 设置当前和上一周期的日期范围
    switch (timePeriod) {
      case 'today':
        // 今天 vs 昨天
        currentStart = new Date(now);
        currentStart.setHours(0, 0, 0, 0);
        
        previousStart = new Date(now);
        previousStart.setDate(now.getDate() - 1);
        previousStart.setHours(0, 0, 0, 0);
        
        previousEnd = new Date(now);
        previousEnd.setDate(now.getDate() - 1);
        previousEnd.setHours(23, 59, 59, 999);
        break;
        
      case 'week':
        // 近7天 vs 前7天
        currentStart = new Date(now);
        currentStart.setDate(now.getDate() - 7);
        currentStart.setHours(0, 0, 0, 0);
        
        previousStart = new Date(now);
        previousStart.setDate(now.getDate() - 14);
        previousStart.setHours(0, 0, 0, 0);
        
        previousEnd = new Date(now);
        previousEnd.setDate(now.getDate() - 8);
        previousEnd.setHours(23, 59, 59, 999);
        break;
        
      case 'month':
        // 本月 vs 上月
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        currentStart.setHours(0, 0, 0, 0);
        
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousStart.setHours(0, 0, 0, 0);
        
        previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        previousEnd.setHours(23, 59, 59, 999);
        break;
        
      case 'year':
        // 本年 vs 上年
        currentStart = new Date(now.getFullYear(), 0, 1);
        currentStart.setHours(0, 0, 0, 0);
        
        previousStart = new Date(now.getFullYear() - 1, 0, 1);
        previousStart.setHours(0, 0, 0, 0);
        
        previousEnd = new Date(now.getFullYear() - 1, 11, 31);
        previousEnd.setHours(23, 59, 59, 999);
        break;
        
      default:
        return null;
    }
    
    // 计算当前和上一周期的金额
    const currentTransactions = getTransactionsByDateRange(currentStart, now);
    const previousTransactions = getTransactionsByDateRange(previousStart, previousEnd);
    
    let currentAmount = 0;
    let previousAmount = 0;
    
    switch (type) {
      case 'balance':
        currentAmount = getBalance(currentTransactions);
        previousAmount = getBalance(previousTransactions);
        break;
      case 'income':
        currentAmount = getTotalIncome(currentTransactions);
        previousAmount = getTotalIncome(previousTransactions);
        break;
      case 'expense':
        currentAmount = getTotalExpense(currentTransactions);
        previousAmount = getTotalExpense(previousTransactions);
        break;
    }
    
    // 计算变化百分比
    if (previousAmount === 0) return null;
    
    const changePercent = ((currentAmount - previousAmount) / previousAmount) * 100;
    
    return {
      percent: Math.abs(changePercent).toFixed(1),
      isPositive: (type === 'income' && changePercent > 0) || 
                 (type === 'expense' && changePercent < 0) ||
                 (type === 'balance' && changePercent > 0)
    };
  };
  
  const trend = calculateTrend();
  
  return (
    <motion.div 
      className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {/* 卡片头部 */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: getIconBackground() }}
          >
            <i className={`fa-solid ${icon} text-white text-xl`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="text-sm mt-0.5 flex items-center">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className={`bg-transparent border-none focus:outline-none ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {periodOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value} 
                    className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {trend && (
                <span className={`ml-2 flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.isPositive ? (
                    <i className="fa-solid fa-arrow-up text-xs mr-0.5"></i>
                  ) : (
                    <i className="fa-solid fa-arrow-down text-xs mr-0.5"></i>
                  )}
                  {trend.percent}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 金额显示 */}
        <motion.div 
          className={`text-2xl font-bold ${getAmountColor()}`}
          key={amount} // 当金额改变时触发动画
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formattedAmount}
        </motion.div>
      </div>
      
      {/* 图表预览（简单的迷你图表） */}
      <div className={`p-3 pt-0 ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
        <div className="h-10 flex items-end justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            // 生成随机高度来模拟图表趋势
            const height = Math.floor(Math.random() * 50) + 10;
            return (
              <div 
                key={i} 
                className={`w-2 rounded-t-full ${getAmountColor()}`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsCard;