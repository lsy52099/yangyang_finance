import React, { useState } from 'react';
import { useCategory } from '@/contexts/categoryContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

const Categories: React.FC = () => {
  const { isDark } = useTheme();
  const { categories, addCategory, deleteCategory } = useCategory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [categoryIcon, setCategoryIcon] = useState('fa-tag');
  const [categoryColor, setCategoryColor] = useState('#3B82F6');
  
  // 预设的图标选项
  const iconOptions = [
    'fa-tag', 'fa-utensils', 'fa-car', 'fa-shopping-cart', 'fa-film', 
    'fa-home', 'fa-heartbeat', 'fa-graduation-cap', 'fa-money-bill-wave', 
    'fa-chart-line', 'fa-briefcase', 'fa-gift', 'fa-plus-circle', 'fa-minus-circle'
  ];
  
  // 预设的颜色选项
  const colorOptions = [
    '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#6366F1', '#F97316', '#06B6D4', '#14B8A6'
  ];
  
  // 处理添加分类
  const handleAddCategory = () => {
    // 表单验证
    if (!categoryName.trim()) {
      toast.error('请输入分类名称');
      return;
    }
    
    // 检查分类名称是否已存在
    const nameExists = categories.some(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase() && cat.type === categoryType
    );
    
    if (nameExists) {
      toast.error('该分类名称已存在');
      return;
    }
    
    addCategory({
      name: categoryName.trim(),
      type: categoryType,
      icon: categoryIcon,
      color: categoryColor,
    });
    
    toast.success('分类已添加');
    
    // 重置表单
    setCategoryName('');
    setShowAddForm(false);
  };
  
  // 处理删除分类
  const handleDeleteCategory = (id: string) => {
    const success = deleteCategory(id);
    if (success) {
      toast.success('分类已删除');
    } else {
      toast.error('系统分类无法删除');
    }
  };
  
  // 过滤出收入和支出分类
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
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
          分类管理
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
          <span>添加分类</span>
        </motion.button>
      </div>
      
      {/* 分类列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 支出分类 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fa-solid fa-minus-circle text-red-500 mr-2"></i>
            支出分类
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <motion.div
                key={category.id}
                className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md relative transition-all duration-200 hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <i className={`fa-solid ${category.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                
                {/* 删除按钮（仅对自定义分类显示） */}
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 opacity-0 hover:opacity-100"
                  aria-label="删除"
                >
                  <i className="fa-solid fa-trash-alt"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* 收入分类 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fa-solid fa-plus-circle text-green-500 mr-2"></i>
            收入分类
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {incomeCategories.map((category) => (
              <motion.div
                key={category.id}
                className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md relative transition-all duration-200 hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <i className={`fa-solid ${category.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                
                {/* 删除按钮（仅对自定义分类显示） */}
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 opacity-0 hover:opacity-100"
                  aria-label="删除"
                >
                  <i className="fa-solid fa-trash-alt"></i>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* 添加分类表单 */}
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
            <h2 className="text-xl font-bold mb-6">添加分类</h2>
            
            <div className="space-y-4">
              {/* 分类名称 */}
              <div>
                <label className="block text-sm font-medium mb-2">分类名称</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="请输入分类名称"
                  className={`w-full py-3 px-4 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  autoFocus
                />
              </div>
              
              {/* 分类类型 */}
              <div>
                <label className="block text-sm font-medium mb-2">分类类型</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCategoryType('expense')}
                    className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      categoryType === 'expense'
                        ? 'bg-red-500 text-white'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <i className="fa-solid fa-minus-circle"></i>
                    <span>支出</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryType('income')}
                    className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      categoryType === 'income'
                        ? 'bg-green-500 text-white'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <i className="fa-solid fa-plus-circle"></i>
                    <span>收入</span>
                  </button>
                </div>
              </div>
              
              {/* 选择图标 */}
              <div>
                <label className="block text-sm font-medium mb-2">选择图标</label>
                <div className={`p-3 rounded-lg border ${
                  isDark
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                } overflow-x-auto`}>
                  <div className="flex space-x-3 pb-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setCategoryIcon(icon)}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          categoryIcon === icon
                            ? `bg-blue-100 text-blue-600 ${isDark ? 'bg-blue-900 text-blue-200' : ''}`
                            : `${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`
                        }`}
                        aria-label={`选择${icon}图标`}
                      >
                        <i className={`fa-solid ${icon} text-xl`}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 选择颜色 */}
              <div>
                <label className="block text-sm font-medium mb-2">选择颜色</label>
                <div className="flex space-x-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCategoryColor(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-200 border-2 ${
                        categoryColor === color
                          ? 'border-blue-500 scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`选择${color}颜色`}
                    />
                  ))}
                </div>
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
                  onClick={handleAddCategory}
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

export default Categories;