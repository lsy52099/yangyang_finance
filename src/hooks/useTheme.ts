import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // 始终使用亮色主题，不再自动检测系统偏好
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 由于默认使用亮色主题，切换主题功能可以保留但在UI中隐藏
  const toggleTheme = () => {
    // 不执行任何操作，保持亮色主题
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
} 