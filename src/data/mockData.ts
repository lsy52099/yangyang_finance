import type { Category, Transaction, Budget } from '@/types';

// 模拟分类数据
export const mockCategories: Category[] = [
  // 收入分类
  { id: '1', name: '工资', icon: 'fa-money-bill-wave', type: 'income', color: '#10B981' },
  { id: '2', name: '投资收益', icon: 'fa-chart-line', type: 'income', color: '#3B82F6' },
  { id: '3', name: '兼职', icon: 'fa-briefcase', type: 'income', color: '#8B5CF6' },
  { id: '4', name: '红包', icon: 'fa-gift', type: 'income', color: '#EC4899' },
  { id: '5', name: '其他收入', icon: 'fa-plus-circle', type: 'income', color: '#F59E0B' },
  
  // 支出分类
  { id: '6', name: '餐饮', icon: 'fa-utensils', type: 'expense', color: '#EF4444' },
  { id: '7', name: '交通', icon: 'fa-car', type: 'expense', color: '#F59E0B' },
  { id: '8', name: '购物', icon: 'fa-shopping-cart', type: 'expense', color: '#8B5CF6' },
  { id: '9', name: '娱乐', icon: 'fa-film', type: 'expense', color: '#EC4899' },
  { id: '10', name: '住房', icon: 'fa-home', type: 'expense', color: '#3B82F6' },
  { id: '11', name: '医疗', icon: 'fa-heartbeat', type: 'expense', color: '#10B981' },
  { id: '12', name: '教育', icon: 'fa-graduation-cap', type: 'expense', color: '#6366F1' },
  { id: '13', name: '其他支出', icon: 'fa-minus-circle', type: 'expense', color: '#6B7280' },
];

// 生成过去30天的模拟交易数据
export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // 收入交易
  const incomeCategories = mockCategories.filter(cat => cat.type === 'income');
  // 支出交易
  const expenseCategories = mockCategories.filter(cat => cat.type === 'expense');
  
  // 生成过去30天的交易
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // 每天生成1-3笔交易
    const transactionCount = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < transactionCount; j++) {
      // 80%的概率是支出，20%的概率是收入
      const isExpense = Math.random() > 0.2;
      const categories = isExpense ? expenseCategories : incomeCategories;
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // 生成金额（支出较小，收入较大）
      const amount = isExpense 
        ? Math.floor(Math.random() * 200) + 10 
        : Math.floor(Math.random() * 1000) + 100;
      
      transactions.push({
        id: `tx-${Date.now()}-${i}-${j}`,
        amount,
        type: isExpense ? 'expense' : 'income',
        categoryId: category.id,
        date: new Date(date),
        description: `${category.name}消费`,
        tags: isExpense && ['日常开销'],
      });
    }
  }
  
  return transactions;
};

// 生成模拟预算数据
export const generateMockBudgets = (): Budget[] => {
  const budgets: Budget[] = [];
  const expenseCategories = mockCategories.filter(cat => cat.type === 'expense');
  
  expenseCategories.forEach(category => {
    // 为主要支出分类设置预算
    if (['餐饮', '交通', '购物', '住房'].includes(category.name)) {
      budgets.push({
        id: `budget-${category.id}`,
        categoryId: category.id,
        amount: category.name === '住房' ? 3000 : Math.floor(Math.random() * 1000) + 500,
        spent: 0, // 将在应用加载时计算
        period: 'monthly',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      });
    }
  });
  
  return budgets;
};

// 模拟用户数据
export const mockUser = {
  id: 'user-001',
  username: '阳阳',
  email: 'yangyang@example.com',
};

// 模拟登录凭据
export const mockCredentials = {
  username: 'admin',
  password: 'password',
};