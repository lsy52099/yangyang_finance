import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Budget } from '@/types';
import { generateMockBudgets } from '@/data/mockData';
import { useTransaction } from './transactionContext';
import { useCategory } from './categoryContext';

interface BudgetContextType {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  calculateBudgetSpent: (budgetId: string) => number;
  getBudgetProgress: (budgetId: string) => number;
  clearBudgets: () => void;
  seedMockBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { transactions, getTransactionsByCategory, getTransactionsByDateRange } = useTransaction();
  const { getCategoryById } = useCategory();
  const getSettings = () => {
    try {
      const raw = localStorage.getItem('userSettings');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  // 从localStorage加载数据或初始化模拟数据
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      try {
        const parsedBudgets = JSON.parse(savedBudgets).map((budget: any) => ({
          ...budget,
          startDate: new Date(budget.startDate),
        }));
        if (Array.isArray(parsedBudgets) && parsedBudgets.length === 0) {
          const cleared = localStorage.getItem('userCleared_budgets') === 'true';
          setBudgets(cleared ? [] : generateMockBudgets());
        } else {
          setBudgets(parsedBudgets);
        }
      } catch (error) {
        try {
          const decoded = atob(savedBudgets);
          const parsedBudgets = JSON.parse(decoded).map((budget: any) => ({
            ...budget,
            startDate: new Date(budget.startDate),
          }));
          if (Array.isArray(parsedBudgets) && parsedBudgets.length === 0) {
            const cleared = localStorage.getItem('userCleared_budgets') === 'true';
            setBudgets(cleared ? [] : generateMockBudgets());
          } else {
            setBudgets(parsedBudgets);
          }
        } catch (err2) {
          console.error('Failed to parse saved budgets:', error);
          setBudgets(generateMockBudgets());
        }
      }
    } else {
      setBudgets(generateMockBudgets());
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    const settings = getSettings();
    const encrypt = !!settings.dataEncryptionEnabled;
    const payload = JSON.stringify(budgets);
    try {
      localStorage.setItem('budgets', encrypt ? btoa(payload) : payload);
    } catch {}
  }, [budgets]);

  // 计算预算支出
  const calculateBudgetSpent = (budgetId: string): number => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return 0;

    // 获取当前预算周期的开始和结束日期
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (budget.period) {
      case 'weekly':
        // 本周开始（周一）
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay() + 1);
        startDate.setHours(0, 0, 0, 0);
        // 本周结束（周日）
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        // 本月开始
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        // 本月结束
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        // 本年开始
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        // 本年结束
        endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // 获取该周期内该分类的所有支出
    const categoryTransactions = getTransactionsByCategory(budget.categoryId);
    const periodTransactions = getTransactionsByDateRange(startDate, endDate);
    
    const relevantTransactions = categoryTransactions.filter(tx => 
      periodTransactions.some(pt => pt.id === tx.id) && tx.type === 'expense'
    );

    return relevantTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  };

  // 更新所有预算的支出金额
  useEffect(() => {
    setBudgets(prevBudgets => 
      prevBudgets.map(budget => ({
        ...budget,
        spent: calculateBudgetSpent(budget.id),
      }))
    );
  }, [transactions, getTransactionsByCategory, getTransactionsByDateRange]);

  // 添加预算
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `budget-${Date.now()}`,
      spent: 0, // 将在上面的useEffect中计算
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  // 更新预算
  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === id 
          ? { 
              ...budget, 
              ...updatedBudget,
              startDate: updatedBudget.startDate ? new Date(updatedBudget.startDate) : budget.startDate
            } 
          : budget
      )
    );
  };

  // 删除预算
  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // 清空所有预算
  const clearBudgets = () => {
    setBudgets([]);
    try {
      localStorage.setItem('budgets', JSON.stringify([]));
    } catch {}
  };

  // 载入示例预算数据（用户可在设置页触发）
  const seedMockBudgets = () => {
    const mocks = generateMockBudgets();
    setBudgets(mocks);
    try {
      const settings = getSettings();
      const encrypt = !!settings.dataEncryptionEnabled;
      const payload = JSON.stringify(mocks);
      localStorage.setItem('budgets', encrypt ? btoa(payload) : payload);
    } catch {}
  };

  // 获取预算进度百分比
  const getBudgetProgress = (budgetId: string): number => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget || budget.amount === 0) return 0;
    
    const spent = calculateBudgetSpent(budgetId);
    return Math.min((spent / budget.amount) * 100, 100);
  };

  const value: BudgetContextType = {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    calculateBudgetSpent,
    getBudgetProgress,
    clearBudgets,
    seedMockBudgets,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
