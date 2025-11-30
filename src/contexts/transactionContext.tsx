import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Transaction } from '@/types';
import { generateMockTransactions } from '@/data/mockData';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  seedMockTransactions: () => void;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTotalIncome: (transactions?: Transaction[]) => number;
  getTotalExpense: (transactions?: Transaction[]) => number;
  getBalance: (transactions?: Transaction[]) => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const getSettings = () => {
    try {
      const raw = localStorage.getItem('userSettings');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  // 从localStorage加载数据或初始化模拟数据
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({
          ...tx,
          date: new Date(tx.date),
        }));
        if (Array.isArray(parsedTransactions) && parsedTransactions.length === 0) {
          const cleared = localStorage.getItem('userCleared_transactions') === 'true';
          if (cleared) {
            setTransactions([]);
          } else {
            setTransactions(generateMockTransactions());
          }
        } else {
          setTransactions(parsedTransactions);
        }
      } catch (error) {
        try {
          const decoded = atob(savedTransactions);
          const parsedTransactions = JSON.parse(decoded).map((tx: any) => ({
            ...tx,
            date: new Date(tx.date),
          }));
          if (Array.isArray(parsedTransactions) && parsedTransactions.length === 0) {
            const cleared = localStorage.getItem('userCleared_transactions') === 'true';
            setTransactions(cleared ? [] : generateMockTransactions());
          } else {
            setTransactions(parsedTransactions);
          }
        } catch (err2) {
          console.error('Failed to parse saved transactions:', error);
          setTransactions(generateMockTransactions());
        }
      }
    } else {
      setTransactions(generateMockTransactions());
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    const settings = getSettings();
    const encrypt = !!settings.dataEncryptionEnabled;
    const payload = JSON.stringify(transactions);
    try {
      localStorage.setItem('transactions', encrypt ? btoa(payload) : payload);
    } catch {}
  }, [transactions]);

  // 添加交易
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
    };
    setTransactions(prev => {
      const next = [newTransaction, ...prev];
      try {
        const settings = getSettings();
        const encrypt = !!settings.dataEncryptionEnabled;
        const payload = JSON.stringify(next);
        localStorage.setItem('transactions', encrypt ? btoa(payload) : payload);
      } catch {}
      return next;
    });
  };

  // 更新交易
  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => {
      const next = prev.map(tx => 
        tx.id === id 
          ? { 
              ...tx, 
              ...updatedTransaction,
              date: updatedTransaction.date ? new Date(updatedTransaction.date) : tx.date
            } 
          : tx
      );
      try {
        const settings = getSettings();
        const encrypt = !!settings.dataEncryptionEnabled;
        const payload = JSON.stringify(next);
        localStorage.setItem('transactions', encrypt ? btoa(payload) : payload);
      } catch {}
      return next;
    });
  };

  // 删除交易
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // 清空所有交易
  const clearTransactions = () => {
    setTransactions([]);
    try {
      localStorage.setItem('transactions', JSON.stringify([]));
    } catch {}
  };

  // 载入示例交易数据（用户可在设置页触发）
  const seedMockTransactions = () => {
    const mocks = generateMockTransactions();
    setTransactions(mocks);
    try {
      const settings = getSettings();
      const encrypt = !!settings.dataEncryptionEnabled;
      const payload = JSON.stringify(mocks);
      localStorage.setItem('transactions', encrypt ? btoa(payload) : payload);
    } catch {}
  };

  // 按日期范围获取交易
  const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
  };

  // 按分类获取交易
  const getTransactionsByCategory = (categoryId: string): Transaction[] => {
    return transactions.filter(tx => tx.categoryId === categoryId);
  };

  // 获取总收入
  const getTotalIncome = (transactionsToCalculate: Transaction[] = transactions): number => {
    return transactionsToCalculate
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  // 获取总支出
  const getTotalExpense = (transactionsToCalculate: Transaction[] = transactions): number => {
    return transactionsToCalculate
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  // 获取余额
  const getBalance = (transactionsToCalculate: Transaction[] = transactions): number => {
    return getTotalIncome(transactionsToCalculate) - getTotalExpense(transactionsToCalculate);
  };

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    seedMockTransactions,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getTotalIncome,
    getTotalExpense,
    getBalance,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
