import React, { useState } from 'react';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const Records: React.FC = () => {
  const { isDark } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  
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
          交易记录
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
          <span>添加交易</span>
        </motion.button>
      </div>
      
      {/* 交易列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TransactionList />
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

export default Records;