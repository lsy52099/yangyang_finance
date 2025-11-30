import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Category } from '@/types';
import { mockCategories } from '@/data/mockData';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  getCategoriesByType: (type: 'income' | 'expense') => Category[];
  getCategoryById: (id: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // 从localStorage加载数据或初始化模拟数据
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Failed to parse saved categories:', error);
        setCategories(mockCategories);
      }
    } else {
      setCategories(mockCategories);
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  // 添加分类
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  // 更新分类
  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, ...updatedCategory } : cat
      )
    );
  };

  // 删除分类
  const deleteCategory = (id: string): boolean => {
    // 不能删除预设的基础分类
    if (mockCategories.some(cat => cat.id === id)) {
      return false;
    }
    setCategories(prev => prev.filter(cat => cat.id !== id));
    return true;
  };

  // 按类型获取分类
  const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
    return categories.filter(cat => cat.type === type);
  };

  // 按ID获取分类
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const value: CategoryContextType = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};