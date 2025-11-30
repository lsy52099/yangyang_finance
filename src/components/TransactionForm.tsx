import { useState, useEffect } from 'react';
import type { Transaction } from '@/types';
import { useCategory } from '@/contexts/categoryContext';
import { useTransaction } from '@/contexts/transactionContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// 导入useTheme钩子
import { useTheme } from '@/hooks/useTheme';

interface TransactionFormProps {
  onClose?: () => void;
  editingTransaction?: Transaction | null;
}

const TransactionForm = ({ onClose, editingTransaction }: TransactionFormProps) => {
  const { getCategoriesByType, getCategoryById } = useCategory();
  const { addTransaction, updateTransaction } = useTransaction();
  const [type, setType] = useState<'income' | 'expense'>(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState<string>(editingTransaction?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState<string>(editingTransaction?.categoryId || '');
  const [date, setDate] = useState<string>(
    editingTransaction ? editingTransaction.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>(editingTransaction?.description || '');
  const [location, setLocation] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const { isDark } = useTheme();
  const [quickAmounts, setQuickAmounts] = useState<number[]>([50, 100, 200, 500, 1000]);

  // 当类型改变时，重置分类
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    const categories = getCategoriesByType(newType);
    setCategoryId(categories.length > 0 ? categories[0].id : '');
  };

  // 表单加载时设置分类
  useEffect(() => {
    if (!categoryId) {
      const categories = getCategoriesByType(type);
      setCategoryId(categories.length > 0 ? categories[0].id : '');
    }
  }, [type, categoryId, getCategoriesByType]);

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('请输入有效的金额');
      return;
    }
    
    if (!categoryId) {
      toast.error('请选择一个分类');
      return;
    }
    
    if (!date) {
      toast.error('请选择一个日期');
      return;
    }
    
    const now = new Date();
    const [y, m, d] = date.split('-').map(Number);
    const preciseDate = new Date(now);
    preciseDate.setFullYear(y);
    preciseDate.setMonth(m - 1);
    preciseDate.setDate(d);
    const transactionData = {
      amount: Number(amount),
      type,
      categoryId,
      date: preciseDate,
      description: description.trim(),
      location: location.trim(),
      tags: tags,
    };
    
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      toast.success('交易记录已更新');
    } else {
      addTransaction(transactionData);
      toast.success('交易记录已添加');
      
      // 重置表单
          setAmount('');
          setDescription('');
          setLocation('');
          setTags([]);
          setTagInput('');
          setDate(new Date().toISOString().split('T')[0]);
          const categories = getCategoriesByType('expense');
          setCategoryId(categories.length > 0 ? categories[0].id : '');
      setType('expense');
    }
    
    // 如果提供了关闭函数，则关闭表单
    if (onClose) {
      onClose();
    }
  };

  // 获取当前类型的分类
  const currentCategories = getCategoriesByType(type);
  
  // 获取当前分类的名称
  const getCategoryName = (id: string) => {
    const category = getCategoryById(id);
    return category ? category.name : '';
  };

  // 从设置中加载快速金额
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.quickAmounts) {
          setQuickAmounts(settings.quickAmounts.map(Number));
        }
      } catch (error) {
        console.error('Failed to load quick amounts:', error);
      }
    }
  }, []);
  
  // 从设置中加载默认交易类型
  useEffect(() => {
    if (!editingTransaction) {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.defaultTransactionType) {
            setType(settings.defaultTransactionType);
          }
        } catch (error) {
          console.error('Failed to load default transaction type:', error);
        }
      }
    }
  }, [editingTransaction]);
  
  // 预设的快速金额已通过useState定义

  return (
    <motion.div 
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`px-6 py-4 ${type === 'income' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        <h2 className="text-xl font-bold flex items-center">
          {editingTransaction ? (
            <>
              <i className="fa-solid fa-pen-to-square mr-2"></i>
              编辑交易
            </>
          ) : (
            <>
              <i className="fa-solid fa-plus-circle mr-2"></i>
              添加交易
            </>
          )}
        </h2>
      </div>
      
       {/* 确保表单可以滚动，特别是在移动设备上 */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-6">
        <form onSubmit={handleSubmit}>
          {/* 交易类型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">交易类型</label>
            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  type === 'income'
                    ? 'bg-green-500 text-white shadow-md'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa-solid fa-plus-circle"></i>
                <span>收入</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  type === 'expense'
                    ? 'bg-red-500 text-white shadow-md'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa-solid fa-minus-circle"></i>
                <span>支出</span>
              </motion.button>
            </div>
          </div>
          
          {/* 金额输入 */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium mb-2">金额</label>
            <div className={`relative ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-medium text-lg">¥</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full py-4 px-10 rounded-xl border text-xl font-medium ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 focus:border-blue-500'
                    : 'border-gray-300 bg-white focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            
            {/* 快速金额选择 */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`py-2 rounded-lg text-sm font-medium ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200`}
                >
                  ¥{quickAmount}
                </button>
              ))}
            </div>
          </div>
          
          {/* 分类选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">分类</label>
            <div className={`grid grid-cols-4 gap-2 p-2 rounded-xl border ${
              isDark
                ? 'border-gray-600 bg-gray-700'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {currentCategories.map((category) => (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                    categoryId === category.id
                      ? `${isDark ? 'bg-blue-900/40' : 'bg-blue-50'} border border-blue-500`
                      : `${isDark ? 'hover:bg-gray-600' : 'hover:bg-white hover:shadow-sm'}`
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{ backgroundColor: category.color }}
                  >
                    <i className={`fa-solid ${category.icon} text-white`}></i>
                  </div>
                  <span className="text-xs">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* 日期和位置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 日期选择 */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">日期</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full py-3 px-4 rounded-lg border ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 focus:border-blue-500'
                    : 'border-gray-300 bg-white focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>
            
            {/* 位置输入（可选） */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">位置（可选）</label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fa-solid fa-map-marker-alt"></i>
                </span>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="添加位置"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 focus:border-blue-500'
                      : 'border-gray-300 bg-white focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                />
              </div>
            </div>
          </div>
          
          {/* 备注输入 */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium mb-2">备注</label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <i className="fa-solid fa-comment-alt"></i>
              </span>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="添加备注（可选）"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 focus:border-blue-500'
                    : 'border-gray-300 bg-white focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>
          </div>
          
          {/* 标签输入 */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">标签（可选）</label>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                    }
                    setTagInput('');
                  }
                }}
                placeholder="输入标签后按回车添加"
                className={`w-full pl-4 pr-4 py-3 rounded-lg border ${
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>
            
            {/* 已添加的标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      isDark
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((t, i) => i !== index))}
                      className="ml-1.5 text-xs"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-4">
            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3.5 px-4 rounded-lg transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa-solid fa-times mr-2"></i>
                取消
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="flex-1 py-3.5 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {editingTransaction ? (
                <>
                  <i className="fa-solid fa-save mr-2"></i>
                  更新
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  添加
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;
