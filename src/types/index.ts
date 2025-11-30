// 交易类型定义
export type TransactionType = 'income' | 'expense';

// 分类类型定义
export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
}

// 交易记录类型定义
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: Date;
  description: string;
  tags?: string[];
}

// 预算类型定义
export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
}

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
}