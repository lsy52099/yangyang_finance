import React, { useState, useEffect } from 'react';
import { useBudget } from '@/contexts/budgetContext';
import { useCategory } from '@/contexts/categoryContext';
import BudgetItem from '@/components/BudgetItem';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

const Budget: React.FC = () => {
  const { isDark } = useTheme();
  const { budgets, addBudget } = useBudget();
  const { getCategoriesByType, getCategoryById } = useCategory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [refetch, setRefetch] = useState(0);
  
  // 加载支出分类
  useEffect(() => {
    const categories = getCategoriesByType('expense');
    setExpenseCategories(categories);
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [getCategoriesByType, selectedCategoryId]);
  
  const handleUpdate = () => {
    setRefetch(prev => prev + 1);
  };
  
  const handleAddBudget = () => {
    const amount = parseFloat(budgetAmount);
    
    // 表单验证
    if (!selectedCategoryId) {
      toast.error('请选择一个分类');
      return;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('请输入有效的预算金额');
      return;
    }
    
    // 检查是否已存在该分类的预算
    const existingBudget = budgets.find(b => b.categoryId === selectedCategoryId);
    if (existingBudget) {
      toast.error('该分类已存在预算，请选择其他分类或编辑现有预算');
      return;
    }
    
    addBudget({
      categoryId: selectedCategoryId,
      amount,
      period: budgetPeriod,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    });
    toast.success('预算已添加');
    setShowAddForm(false);
    setBudgetAmount('');
    handleUpdate();
  };
  
  // 获取预算分类的名称
  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : '未知分类';
  };
  
  // 计算总预算和总支出
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // 格式化金额
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // 获取总体进度条颜色
  const getOverallProgressColor = () => {
    if (overallProgress < 70) return 'bg-green-500';
    if (overallProgress < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="min-h-screen">
      {/* 页面标题和添加按钮 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          预算管理
        </motion.h1>
        
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <i className="fa-solid fa-plus"></i>
          <span>添加预算</span>
        </motion.button>
      </div>
      
      {/* 总体预算概览 */}
      <motion.div 
        className={`p-6 rounded-xl shadow-md mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">总体预算概览</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">总预算</div>
            <div className="text-2xl font-bold">{formatAmount(totalBudget)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">已支出</div>
            <div className="text-2xl font-bold text-red-500">{formatAmount(totalSpent)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">剩余预算</div>
            <div className="text-2xl font-bold text-green-500">{formatAmount(totalBudget - totalSpent)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">使用进度</div>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
          </div>
        </div>
        
        {/* 总体进度条 */}
        <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
          <motion.div
            className={`h-full rounded-full ${getOverallProgressColor()}`}
            initial={{ width: '0%' }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
      
      {/* 预算列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">分类预算</h2>
        
        {budgets.length === 0 ? (
          <div className={`p-8 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <i className="fa-solid fa-chart-pie text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium mb-2">暂无预算</h3>
            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              点击"添加预算"按钮开始设置您的预算计划
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              添加预算
            </button>
          </div>
        ) : (
          budgets.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} onUpdate={handleUpdate} />
          ))
        )}
      </motion.div>
      
      {/* 添加预算表单 */}
      {showAddForm && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`w-full max-w-md p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2 className="text-xl font-bold mb-6">添加预算</h2>
            
            <div className="space-y-4">
              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium mb-2">选择分类</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className={`w-full py-3 px-4 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  <option value="" disabled>请选择分类</option>
                  {expenseCategories.map((category) => {
                    // 检查该分类是否已有预算
                    const hasBudget = budgets.some(b => b.categoryId === category.id);
                    return (
                      <option 
                        key={category.id} 
                        value={category.id}
                        disabled={hasBudget}
                      >
                        {category.name} {hasBudget && '(已存在预算)'}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* 预算金额 */}
              <div>
                <label className="block text-sm font-medium mb-2">预算金额</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">¥</span>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                      isDark
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              {/* 预算周期 */}
              <div>
                <label className="block text-sm font-medium mb-2">预算周期</label>
                <select
                  value={budgetPeriod}
                  onChange={(e) => setBudgetPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                  className={`w-full py-3 px-4 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                  <option value="yearly">每年</option>
                </select>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  取消
                </button>
                <button
                  onClick={handleAddBudget}
                  className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                >
                  添加
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Budget;
