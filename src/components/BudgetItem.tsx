import React, { useState } from 'react';
import { useBudget } from '@/contexts/budgetContext';
import { useCategory } from '@/contexts/categoryContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// 导入useTheme钩子
import { useTheme } from '@/hooks/useTheme';

interface BudgetItemProps {
  budget: any;
  onUpdate: () => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onUpdate }) => {
  const { deleteBudget, getBudgetProgress, calculateBudgetSpent, updateBudget } = useBudget();
  const { getCategoryById } = useCategory();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget.amount.toString());
  const { isDark } = useTheme();
  
  // 获取分类信息
  const category = getCategoryById(budget.categoryId);
  
  // 计算预算进度
  const progress = getBudgetProgress(budget.id);
  const spent = calculateBudgetSpent(budget.id);
  
  // 格式化金额
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // 获取进度条颜色
  const getProgressColor = () => {
    if (progress < 70) return 'bg-green-500';
    if (progress < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // 处理删除预算
  const handleDelete = () => {
    if (window.confirm('确定要删除此预算吗？')) {
      deleteBudget(budget.id);
      toast.success('预算已删除');
      onUpdate();
    }
  };
  
  // 处理更新预算
  const handleUpdate = () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('请输入有效的预算金额');
      return;
    }
    
    // 使用budgetContext中的updateBudget方法
    updateBudget(budget.id, { amount });
    
    toast.success('预算已更新');
    setIsEditing(false);
    onUpdate();
  };
  
  // 处理取消编辑
  const handleCancel = () => {
    setBudgetAmount(budget.amount.toString());
    setIsEditing(false);
  };
  
  // 计算剩余预算
  const remaining = budget.amount - spent;
  
  return (
    <motion.div
      className={`p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <div className="flex items-center space-x-4">
          {category && (
            <>
              <span className="p-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }}>
                <i className={`fa-solid ${category.icon} text-white text-lg`}></i>
              </span>
              <div>
                <h4 className="font-semibold text-lg">{category.name}</h4>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {budget.period === 'weekly' ? '每周预算' : 
                   budget.period === 'monthly' ? '每月预算' : '每年预算'}
                </p>
              </div>
            </>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex space-x-3 mt-4 md:mt-0">
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'border-gray-500 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              step="0.01"
              min="0"
              placeholder="预算金额"
            />
            <button
              onClick={handleUpdate}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150 flex items-center"
              aria-label="保存"
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button
              onClick={handleCancel}
              className={`p-2 rounded-lg transition-colors duration-150 flex items-center ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="取消"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end mt-4 md:mt-0">
            <div className="flex items-center space-x-1.5">
              <span className={`text-lg font-medium ${progress > 90 ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {formatAmount(spent)}
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>/</span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {formatAmount(budget.amount)}
              </span>
            </div>
            <div className={`text-sm mt-1 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {remaining < 0 ? `超出 ${formatAmount(Math.abs(remaining))}` : `剩余 ${formatAmount(remaining)}`}
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                } transition-colors duration-150`}
                aria-label="编辑"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <button
                onClick={handleDelete}
                className={`p-1.5 rounded-lg ${
                  isDark
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                } transition-colors duration-150`}
                aria-label="删除"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 进度条 */}
      <div className="mt-3">
        <div className={`h-2.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} overflow-hidden`}>
          <motion.div
            className={`h-full rounded-full ${getProgressColor()}`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs">
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>0%</span>
          <span className="font-medium">{progress.toFixed(1)}%</span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>100%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetItem;