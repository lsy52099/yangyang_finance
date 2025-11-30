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
  resetCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const getSettings = () => {
    try {
      const raw = localStorage.getItem('userSettings');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  // 从localStorage加载数据或初始化模拟数据
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length === 0) {
          const cleared = localStorage.getItem('userCleared_categories') === 'true';
          setCategories(cleared ? [] : mockCategories);
        } else {
          setCategories(parsed);
        }
      } catch (error) {
        try {
          const decoded = atob(savedCategories);
          const parsed = JSON.parse(decoded);
          if (Array.isArray(parsed) && parsed.length === 0) {
            const cleared = localStorage.getItem('userCleared_categories') === 'true';
            setCategories(cleared ? [] : mockCategories);
          } else {
            setCategories(parsed);
          }
        } catch (err2) {
          console.error('Failed to parse saved categories:', error);
          setCategories(mockCategories);
        }
      }
    } else {
      setCategories(mockCategories);
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    const settings = getSettings();
    const encrypt = !!settings.dataEncryptionEnabled;
    const payload = JSON.stringify(categories);
    try {
      localStorage.setItem('categories', encrypt ? btoa(payload) : payload);
    } catch {}
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

  // 重置分类到默认预设
  const resetCategories = () => {
    setCategories(mockCategories);
    try {
      const settings = getSettings();
      const encrypt = !!settings.dataEncryptionEnabled;
      const payload = JSON.stringify(mockCategories);
      localStorage.setItem('categories', encrypt ? btoa(payload) : payload);
    } catch {}
  };

  const value: CategoryContextType = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
    getCategoryById,
    resetCategories,
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
