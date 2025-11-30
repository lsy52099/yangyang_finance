import React, { useState, useEffect } from 'react';
import { useTransaction } from '@/contexts/transactionContext';
import { useCategory } from '@/contexts/categoryContext';
import TransactionForm from './TransactionForm';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// 导入useTheme钩子
import { useTheme } from '@/hooks/useTheme';

interface TransactionListProps {
  // 可以添加props，比如筛选条件
}

const TransactionList: React.FC<TransactionListProps> = () => {
  const { transactions, deleteTransaction } = useTransaction();
  const { getCategoryById } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showEditForm, setShowEditForm] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  
  // 从本地存储加载视图模式设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.transactionView) {
          setViewMode(settings.transactionView);
        }
      } catch (error) {
        console.error('Failed to load view mode setting:', error);
      }
    }
  }, []);

  // 获取所有分类用于筛选
  const { getCategoriesByType } = useCategory();
  const allCategories = getCategoriesByType('income').concat(getCategoriesByType('expense'));

  // 过滤和排序交易
  useEffect(() => {
    let result = [...transactions];
    
    // 按类型过滤
    if (selectedType !== 'all') {
      result = result.filter(tx => tx.type === selectedType);
    }
    
    // 按分类过滤
    if (selectedCategory !== 'all') {
      result = result.filter(tx => tx.categoryId === selectedCategory);
    }
    
    // 按标签过滤
    if (selectedTag !== 'all' && selectedTag !== '') {
      result = result.filter(tx => tx.tags && tx.tags.includes(selectedTag));
    }
    
    // 按搜索词过滤（描述或分类名称）
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => {
        const category = getCategoryById(tx.categoryId);
        return (
          tx.description.toLowerCase().includes(term) ||
          (category && category.name.toLowerCase().includes(term)) ||
          (tx.location && tx.location.toLowerCase().includes(term))
        );
      });
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    
    setFilteredTransactions(result);
  }, [transactions, selectedType, selectedCategory, searchTerm, sortBy, sortOrder, getCategoryById, getCategoriesByType]);
  
  // 处理排序切换
  const handleSortToggle = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // 处理编辑交易
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };
  
  // 处理删除交易
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('确定要删除这条交易记录吗？')) {
      deleteTransaction(id);
      toast.success('交易记录已删除');
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  
  // 获取日期详情
  const getDateDetails = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
  };
  
  // 格式化金额
  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    const colorClass = type === 'income' ? 'text-green-500' : 'text-red-500';
    
    return (
      <span className={`font-medium ${colorClass}`}>
        {sign}¥{amount.toFixed(2)}
      </span>
    );
  };
  
  // 获取分类图标和名称
  const getCategoryInfo = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (!category) {
      return { icon: 'fa-question-circle', name: '未知分类', color: '#6B7280' };
    }
    return {
      icon: category.icon,
      name: category.name,
      color: category.color,
    };
  };
  
  // 渲染列表视图
  const renderListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`${isDark ? 'bg-gray-850 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
            <th className="px-5 py-4 text-left text-sm font-medium">日期</th>
            <th className="px-5 py-4 text-left text-sm font-medium">分类</th>
            <th className="px-5 py-4 text-left text-sm font-medium">描述</th>
            {filteredTransactions.some(tx => tx.location) && (
              <th className="px-5 py-4 text-left text-sm font-medium">位置</th>
            )}
            <th 
              className="px-5 py-4 text-right text-sm font-medium cursor-pointer"
              onClick={() => handleSortToggle('amount')}
            >
              金额
              <i className={`fa-solid ml-1 ${sortBy === 'amount' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
            </th>
            <th className="px-5 py-4 text-right text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {filteredTransactions.map((transaction) => {
              const categoryInfo = getCategoryInfo(transaction.categoryId);
              
              return (
                <motion.tr 
                  key={transaction.id}
                  className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} transition-colors duration-150`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-5 py-4 text-sm">
                    <div className="flex flex-col">
                      <span>{formatDate(transaction.date.toString())}</span>
                      <span className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getDateDetails(transaction.date.toString()).split(' ')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`p-1.5 rounded-full`} style={{ backgroundColor: categoryInfo.color }}>
                        <i className={`fa-solid ${categoryInfo.icon} text-white`}></i>
                      </span>
                      <span>{categoryInfo.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">
                      {transaction.description || '无描述'}
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transaction.tags.map((tag: string, index: number) => (
                            <span 
                              key={index} 
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                  </td>
                  {filteredTransactions.some(tx => tx.location) && (
                    <td className="px-5 py-4 text-sm">
                      {transaction.location ? (
                        <div className="flex items-center">
                          <i className="fa-solid fa-map-marker-alt text-gray-400 mr-1"></i>
                          {transaction.location}
                        </div>
                      ) : '-'}
                    </td>
                  )}
                  <td className="px-5 py-4 text-sm text-right">
                    {formatAmount(transaction.amount, transaction.type)}
                  </td>
                  <td className="px-5 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className={`p-1.5 rounded-md transition-colors duration-150 ${
                          isDark
                            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                        aria-label="编辑"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className={`p-1.5 rounded-md transition-colors duration-150 ${
                          isDark
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        aria-label="删除"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
          
          {/* 无数据状态 */}
          {filteredTransactions.length === 0 && (
            <tr>
              <td 
                colSpan={filteredTransactions.some(tx => tx.location) ? 6 : 5} 
                className="px-5 py-12 text-center"
              >
                <div className={`flex flex-col items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                    <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
                  </div>
                  <p className="text-lg font-medium">暂无交易记录</p>
                  <p className="text-sm mt-1">添加一些交易记录来跟踪您的财务状况</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  // 渲染卡片视图
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {filteredTransactions.map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction.categoryId);
          
          return (
            <motion.div
              key={transaction.id}
              className={`rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${
                isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -2 }}
            >
              <div className={`p-4 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{formatDate(transaction.date.toString())}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                      aria-label="编辑"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                      aria-label="删除"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center space-x-4 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: categoryInfo.color }}
                  >
                    <i className={`fa-solid ${categoryInfo.icon} text-white`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium">{categoryInfo.name}</h4>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {getDateDetails(transaction.date.toString())}
                    </p>
                  </div>
                </div>
                {transaction.description && (
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {transaction.description}
                  </p>
                )}
                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {transaction.tags.map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {transaction.location && (
                  <div className={`text-xs mb-4 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <i className="fa-solid fa-map-marker-alt mr-1"></i>
                    {transaction.location}
                  </div>
                )}
                <div className="text-right">
                  <span className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* 无数据状态 */}
      {filteredTransactions.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className={`flex flex-col items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
            </div>
            <p className="text-lg font-medium">暂无交易记录</p>
            <p className="text-sm mt-1">添加一些交易记录来跟踪您的财务状况</p>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* 搜索和筛选栏 */}
      <div className={`p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <i className={`fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}></i>
            <input
              type="text"
              placeholder="搜索交易..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
          </div>
          
          {/* 筛选器 */}
          <div className="flex flex-wrap gap-3">
            {/* 类型筛选 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
              className={`px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="all">全部类型</option>
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
            
            {/* 分类筛选 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="all">全部分类</option>
              {allCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            {/* 视图切换 */}
            <div className={`flex p-1 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                aria-label="列表视图"
              >
                <i className="fa-solid fa-list"></i>
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'card'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                aria-label="卡片视图"
              >
                <i className="fa-solid fa-th-large"></i>
              </button>
            </div>
            
            {/* 标签筛选 */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="all">全部标签</option>
              {/* 获取所有唯一标签 */}
              {Array.from(new Set(transactions.flatMap(tx => tx.tags || []))).map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 排序按钮 */}
        <div className="mt-3 flex items-center">
          <span className={`text-sm mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>排序:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSortToggle('date')}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                sortBy === 'date'
                  ? isDark
                    ? 'bg-blue-900/40 text-blue-400'
                    : 'bg-blue-100 text-blue-600'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              日期
              <i className={`fa-solid ml-1 ${sortBy === 'date' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
            </button>
            <button
              onClick={() => handleSortToggle('amount')}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                sortBy === 'amount'
                  ? isDark
                    ? 'bg-blue-900/40 text-blue-400'
                    : 'bg-blue-100 text-blue-600'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              金额
              <i className={`fa-solid ml-1 ${sortBy === 'amount' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
            </button>
          </div>
          
          {/* 筛选结果统计 */}
          <div className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            共 {filteredTransactions.length} 条记录
          </div>
        </div>
      </div>
      
      {/* 交易列表/卡片 */}
      <div className="p-5">
        {viewMode === 'list' ? renderListView() : renderCardView()}
      </div>
      
      {/* 编辑表单模态框 */}
      <AnimatePresence>
        {showEditForm && (
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
                editingTransaction={editingTransaction}
                onClose={() => {
                  setShowEditForm(false);
                  setEditingTransaction(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;