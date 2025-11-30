import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useBudget } from '@/contexts/budgetContext';
import { useCategory } from '@/contexts/categoryContext';
import { useTransaction } from '@/contexts/transactionContext';

const Settings: React.FC = () => {
  const { isDark } = useTheme();
  const { budgets, updateBudget, clearBudgets, seedMockBudgets } = useBudget();
  const { categories, resetCategories } = useCategory();
  const { clearTransactions: clearTxContext, seedMockTransactions } = useTransaction();
  
  // 页面状态
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedCurrency, setSelectedCurrency] = useState('CNY');
  const [transactionView, setTransactionView] = useState<'list' | 'card'>('list');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderDay, setReminderDay] = useState('5');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState('阳阳');
  const [email, setEmail] = useState('yangyang@example.com');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState<string[]>(['50', '100', '200', '500', '1000']);
  const [defaultTransactionType, setDefaultTransactionType] = useState<'expense' | 'income'>('expense');
  const [confirmDeleteTransactions, setConfirmDeleteTransactions] = useState(false);
  const [showChartLegend, setShowChartLegend] = useState(true);
  const [showChartLabels, setShowChartLabels] = useState(false);
  const [chartColorScheme, setChartColorScheme] = useState<'default' | 'pastel' | 'vibrant' | 'monochrome'>('default');
  const [budgetOverspendAlert, setBudgetOverspendAlert] = useState(true);
  const [monthlyReportEnabled, setMonthlyReportEnabled] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [dataEncryptionEnabled, setDataEncryptionEnabled] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const getStoredCount = (key: string) => {
    try {
      const raw = localStorage.getItem(key) || '[]';
      const tryJson = JSON.parse(raw);
      if (Array.isArray(tryJson)) return tryJson.length;
    } catch {}
    try {
      const decoded = atob(localStorage.getItem(key) || '');
      const arr = JSON.parse(decoded);
      if (Array.isArray(arr)) return arr.length;
    } catch {}
    return 0;
  };
  
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 货币选项
  const currencyOptions = [
    { code: 'CNY', name: '人民币 (¥)' },
    { code: 'USD', name: '美元 ($)' },
    { code: 'EUR', name: '欧元 (€)' },
    { code: 'GBP', name: '英镑 (£)' },
    { code: 'JPY', name: '日元 (¥)' },
  ];
  
  // 提醒日期选项
  const reminderDayOptions = Array.from({ length: 28 }, (_, i) => (i + 1).toString());
  
  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.currency) setSelectedCurrency(settings.currency);
        if (settings.transactionView) setTransactionView(settings.transactionView);
        if (settings.notificationsEnabled !== undefined) setNotificationsEnabled(settings.notificationsEnabled);
        if (settings.reminderDay) setReminderDay(settings.reminderDay);
        if (settings.quickAmounts) setQuickAmounts(settings.quickAmounts);
        if (settings.defaultTransactionType) setDefaultTransactionType(settings.defaultTransactionType);
        if (settings.showChartLegend !== undefined) setShowChartLegend(!!settings.showChartLegend);
        if (settings.showChartLabels !== undefined) setShowChartLabels(!!settings.showChartLabels);
        if (settings.chartColorScheme) setChartColorScheme(settings.chartColorScheme);
        if (settings.budgetOverspendAlert !== undefined) setBudgetOverspendAlert(!!settings.budgetOverspendAlert);
        if (settings.monthlyReportEnabled !== undefined) setMonthlyReportEnabled(!!settings.monthlyReportEnabled);
        if (settings.marketingNotifications !== undefined) setMarketingNotifications(!!settings.marketingNotifications);
        if (settings.dataEncryptionEnabled !== undefined) setDataEncryptionEnabled(!!settings.dataEncryptionEnabled);
        if (settings.autoBackupEnabled !== undefined) setAutoBackupEnabled(!!settings.autoBackupEnabled);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.username) setUsername(user.username);
        if (user.email) setEmail(user.email);
        if (user.avatar) setAvatar(user.avatar);
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    }
  }, []);
  
  // 处理设置变更并实时保存
  const handleSettingChange = (settingName: string, value: any) => {
    // 更新状态
    switch (settingName) {
      case 'currency':
        setSelectedCurrency(value);
        break;
      case 'transactionView':
        setTransactionView(value);
        break;
      case 'notificationsEnabled':
        setNotificationsEnabled(value);
        break;
      case 'reminderDay':
        setReminderDay(value);
        break;
      case 'quickAmounts':
        setQuickAmounts(value);
        break;
      case 'defaultTransactionType':
        setDefaultTransactionType(value);
        break;
      case 'showChartLegend':
        setShowChartLegend(!!value);
        break;
      case 'showChartLabels':
        setShowChartLabels(!!value);
        break;
      case 'chartColorScheme':
        setChartColorScheme(value);
        break;
      case 'budgetOverspendAlert':
        setBudgetOverspendAlert(!!value);
        break;
      case 'monthlyReportEnabled':
        setMonthlyReportEnabled(!!value);
        break;
      case 'marketingNotifications':
        setMarketingNotifications(!!value);
        break;
      case 'dataEncryptionEnabled':
        setDataEncryptionEnabled(!!value);
        break;
      case 'autoBackupEnabled':
        setAutoBackupEnabled(!!value);
        break;
      default:
        break;
    }
    
    // 实时保存设置
    try {
      const savedSettings = localStorage.getItem('userSettings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings[settingName] = value;
      localStorage.setItem('userSettings', JSON.stringify(settings));
      toast.success('设置已保存');
    } catch (error) {
      console.error('Failed to save setting:', error);
      toast.error('保存设置失败');
    }
  };
  
  // 保存用户资料
  const saveUserProfile = () => {
    setIsLoading(true);
    
    try {
      // 保存用户资料
      const userInfo = {
        username,
        email,
        avatar
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      toast.success('个人资料已更新');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('保存失败，请重试');
      console.error('Failed to save user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 上传头像功能
  const handleAvatarUpload = () => {
    // 触发隐藏的文件输入框
    fileInputRef.current?.click();
  };
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAvatar(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 导出数据功能 - CSV格式
  const exportData = () => {
    setIsLoading(true);
    
    try {
      // 获取交易数据
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // 构建CSV数据
      let csvContent = "类型,金额,分类,日期,描述,标签\n";
      
      transactions.forEach((transaction: any) => {
        const category = categories.find((cat: any) => cat.id === transaction.categoryId);
        const type = transaction.type === 'income' ? '收入' : '支出';
        const categoryName = category?.name || '未分类';
        const date = new Date(transaction.date).toLocaleDateString('zh-CN');
        const tags = transaction.tags ? transaction.tags.join(';') : '';
        
        // 转义逗号和引号
        const description = transaction.description ? `"${transaction.description.replace(/"/g, '""')}"` : '';
        
        csvContent += `${type},${transaction.amount},${categoryName},${date},${description},${tags}\n`;
      });
      
      // 创建数据URL
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `阳阳记账数据导出_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('数据导出为CSV文件成功');
    } catch (error) {
      toast.error('导出数据失败，请重试');
      console.error('Failed to export data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 备份数据功能 - JSON格式
  const backupData = () => {
    setIsLoading(true);
    
    try {
      // 收集所有数据
      const allData = {
        transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
        categories: JSON.parse(localStorage.getItem('categories') || '[]'),
        budgets: JSON.parse(localStorage.getItem('budgets') || '[]'),
        userSettings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
      };
      
      // 创建数据URL
      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      // 创建下载链接
      const backupFileName = `阳阳记账数据备份_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', backupFileName);
      linkElement.click();
      
      toast.success('数据备份成功');
    } catch (error) {
      toast.error('备份数据失败，请重试');
      console.error('Failed to backup data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 导入数据功能
  const importData = () => {
    // 触发隐藏的文件输入框
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target?.result as string);
            
            // 保存导入的数据到localStorage
            if (importedData.transactions) localStorage.setItem('transactions', JSON.stringify(importedData.transactions));
            if (importedData.categories) localStorage.setItem('categories', JSON.stringify(importedData.categories));
            if (importedData.budgets) localStorage.setItem('budgets', JSON.stringify(importedData.budgets));
            if (importedData.userSettings) localStorage.setItem('userSettings', JSON.stringify(importedData.userSettings));
            if (importedData.userInfo) localStorage.setItem('userInfo', JSON.stringify(importedData.userInfo));
            
            toast.success('数据导入成功，请刷新页面以应用更改');
          } catch (error) {
            toast.error('导入数据格式错误，请检查文件格式');
            console.error('Failed to import data:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };
  
  // 重置数据
  const resetData = () => {
    if (window.confirm('确定要重置所有数据吗？此操作无法撤销！')) {
      setIsLoading(true);
      
      try {
        clearTxContext();
        clearBudgets();
        resetCategories();
        localStorage.removeItem('userSettings');
        try {
          localStorage.setItem('userCleared_transactions', 'true');
          localStorage.setItem('userCleared_budgets', 'true');
          localStorage.removeItem('userCleared_categories');
        } catch {}
        
        // 重置到默认设置
        setSelectedCurrency('CNY');
        setTransactionView('list');
        setNotificationsEnabled(true);
        setReminderDay('5');
        setQuickAmounts(['50', '100', '200', '500', '1000']);
        setDefaultTransactionType('expense');
        
        toast.success('数据已重置');
      } catch (error) {
        toast.error('重置数据失败，请重试');
        console.error('Failed to reset data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 清空交易记录
  const clearTransactions = () => {
    if (window.confirm('确定要清空所有交易记录吗？此操作无法撤销！')) {
      clearTxContext();
      try { localStorage.setItem('userCleared_transactions', 'true'); } catch {}
      toast.success('交易记录已清空');
    }
  };

  // 恢复示例数据（仅在本地设备写入，不上传）
  const seedDemoData = () => {
    if (window.confirm('将恢复示例分类、交易与预算数据，确定继续？')) {
      resetCategories();
      seedMockTransactions();
      seedMockBudgets();
      try {
        localStorage.removeItem('userCleared_transactions');
        localStorage.removeItem('userCleared_budgets');
        localStorage.removeItem('userCleared_categories');
      } catch {}
      toast.success('已恢复示例数据');
    }
  };
  
  // 添加快捷金额
  const addQuickAmount = () => {
    const newAmount = prompt('请输入新的快捷金额：');
    if (newAmount && !isNaN(parseFloat(newAmount)) && parseFloat(newAmount) > 0) {
      const updatedAmounts = [...quickAmounts, newAmount];
      setQuickAmounts(updatedAmounts);
      handleSettingChange('quickAmounts', updatedAmounts);
    } else if (newAmount) {
      toast.error('请输入有效的金额');
    }
  };
  
  // 删除快捷金额
  const removeQuickAmount = (index: number) => {
    const updatedAmounts = quickAmounts.filter((_, i) => i !== index);
    setQuickAmounts(updatedAmounts);
    handleSettingChange('quickAmounts', updatedAmounts);
  };
  
  // 渲染个人设置部分
  const renderPersonalSettings = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
        <h2 className="text-xl font-semibold">账户设置</h2>
        {isEditingProfile ? (
          <button
            onClick={saveUserProfile}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 text-sm flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch fa-spin mr-1"></i>
            ) : (
              <i className="fa-solid fa-check mr-1"></i>
            )}
            保存
          </button>
        ) : (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 text-sm flex items-center"
          >
            <i className="fa-solid fa-edit mr-1"></i>
            编辑
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditingProfile}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              电子邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditingProfile}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              头像
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="用户头像" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-user text-blue-500 text-2xl"></i>
                )}
              </div>
              {isEditingProfile ? (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 transition-colors duration-200 text-sm flex items-center"
                  >
                    <i className="fa-solid fa-upload mr-1"></i>
                    上传新头像
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar(null)}
                      className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors duration-200 text-sm flex items-center"
                    >
                      <i className="fa-solid fa-trash mr-1"></i>
                      删除
                    </button>
                  )}
                </div>
              ) : (
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  点击编辑按钮修改头像
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染图表设置部分
  const renderChartSettings = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">图表设置</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              默认图表类型
            </label>
            <select
              value="pie"
              onChange={() => {}}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="pie">饼图</option>
              <option value="bar">柱状图</option>
              <option value="line">折线图</option>
              <option value="area">面积图</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">显示图例</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                在图表上显示数据图例
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showChartLegend}
                onChange={(e) => handleSettingChange('showChartLegend', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">显示数据标签</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                在图表上显示具体数值
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showChartLabels}
                onChange={(e) => handleSettingChange('showChartLabels', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              图表配色方案
            </label>
            <select
              value={chartColorScheme}
              onChange={(e) => handleSettingChange('chartColorScheme', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="default">默认配色</option>
              <option value="pastel">柔和色调</option>
              <option value="vibrant">鲜艳色调</option>
              <option value="monochrome">单色渐变</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染通知设置部分
  const renderNotificationSettings = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">通知设置</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">启用通知提醒</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                接收预算提醒和财务报告通知
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer ${
                notificationsEnabled
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
              } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
          
          {notificationsEnabled && (
            <>
              <div className="pl-0 md:pl-40 -mt-4 md:mt-0">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  月度预算提醒日期
                </label>
                <select
                  value={reminderDay}
                  onChange={(e) => handleSettingChange('reminderDay', e.target.value)}
                  className={`w-full md:w-auto px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  {reminderDayOptions.map((day) => (
                    <option key={day} value={day}>
                      每月{day}日
                    </option>
                  ))}
                </select>
              </div>
              
          <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">预算超支提醒</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                当预算使用超过80%时提醒
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={budgetOverspendAlert}
                onChange={(e) => handleSettingChange('budgetOverspendAlert', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
              
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">月度财务报告</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                    每月1日发送上月财务总结
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">活动提醒</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                    接收最新功能和优惠活动通知
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  
  // 渲染隐私设置部分
  const renderPrivacySettings = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">隐私设置</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">数据加密</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                本地存储的数据加密处理
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dataEncryptionEnabled}
                onChange={(e) => handleSettingChange('dataEncryptionEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">自动备份</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                每周自动备份您的财务数据
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackupEnabled}
                onChange={(e) => handleSettingChange('autoBackupEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-blue-500`}></div>
            </label>
          </div>
          
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-circle-info text-yellow-500"></i>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  阳阳记账不会收集您的个人身份信息或财务数据。所有数据仅存储在您的设备上。
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Link to="/privacy" className={`text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center`}>
              <i className="fa-solid fa-shield-halved mr-1"></i>
              查看完整隐私政策
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染应用设置部分
  const renderAppSettings = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">应用设置</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              货币单位
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white': 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {currencyOptions.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              交易记录显示方式
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleSettingChange('transactionView', 'list')}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  transactionView === 'list'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className="fa-solid fa-list"></i>
                <span>列表视图</span>
              </button>
              <button
                type="button"
                onClick={() => handleSettingChange('transactionView', 'card')}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  transactionView === 'card'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <i className="fa-solid fa-th-large"></i>
                <span>卡片视图</span>
              </button>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              默认交易类型
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleSettingChange('defaultTransactionType', 'expense')}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  defaultTransactionType === 'expense'
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
                onClick={() => handleSettingChange('defaultTransactionType', 'income')}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  defaultTransactionType === 'income'
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
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                快捷金额设置
              </label>
              <button
                onClick={addQuickAmount}
                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
              >
                <i className="fa-solid fa-plus mr-1"></i>添加
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount, index) => (
                <div 
                  key={index}
                  className="relative"
                >
                  <div className={`p-3 rounded-lg text-center border ${
                    isDark
                      ? 'border-gray-700 bg-gray-750'
                      : 'border-gray-200 bg-white'
                  }`}>
                    <span>¥{amount}</span>
                  </div>
                  <button
                    onClick={() => removeQuickAmount(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                    aria-label="删除"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染数据管理部分
  const renderDataManagement = () => (
    <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold">数据管理</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={exportData}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
              isDark
                ? 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-download text-blue-500 text-xl"></i>
            <span className="font-medium">导出数据 (CSV)</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              将交易记录导出为CSV文件
            </span>
          </button>
          
          <button
            type="button"
            onClick={backupData}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
              isDark
                ? 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-backup text-green-500 text-xl"></i>
            <span className="font-medium">备份数据 (JSON)</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              备份所有应用数据
            </span>
          </button>
          
          <button
            type="button"
            onClick={importData}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
              isDark
                ? 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-upload text-purple-500 text-xl"></i>
            <span className="font-medium">导入数据</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              从备份文件恢复数据
            </span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <button
            type="button"
            onClick={clearTransactions}
            disabled={isLoading}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
              isDark
                ? 'border-red-900/30 bg-red-900/10 text-red-400 hover:bg-red-900/20'
                : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-trash-can text-lg"></i>
            <span className="font-medium">清空交易记录</span>
            <span className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              仅删除交易记录，保留设置
            </span>
          </button>
          
          <button
            type="button"
            onClick={resetData}
            disabled={isLoading}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center space-y-2 ${
              isDark
                ? 'border-orange-900/30 bg-orange-900/10 text-orange-400 hover:bg-orange-900/20'
                : 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-rotate-right text-lg"></i>
            <span className="font-medium">重置所有数据</span>
            <span className={`text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              恢复到应用初始状态
            </span>
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={seedDemoData}
            className={`w-full p-4 rounded-lg border flex items-center justify-center space-x-2 ${
              isDark
                ? 'border-blue-900/30 bg-blue-900/10 text-blue-400 hover:bg-blue-900/20'
                : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
            } transition-all duration-200`}
          >
            <i className="fa-solid fa-seedling"></i>
            <span className="font-medium">恢复示例数据</span>
          </button>
        </div>
        
        {/* 数据大小统计 */}
        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-3">数据存储统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>交易记录</p>
              <p className="font-medium">{getStoredCount('transactions')} 条</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>分类</p>
              <p className="font-medium">{getStoredCount('categories')} 个</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>预算</p>
              <p className="font-medium">{getStoredCount('budgets')} 个</p>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>存储空间</p>
              <p className="font-medium">
                {(new Blob(Object.values(localStorage).map(v => v || '')).size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 根据当前活动部分渲染内容
  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSettings();
      case 'charts':
        return renderChartSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'app':
        return renderAppSettings();
      case 'data':
        return renderDataManagement();
      default:
        return renderPersonalSettings();
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* 页面标题 */}
      <motion.h1 
        className="text-2xl md:text-3xl font-bold mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        设置
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧导航 */}
        <motion.div
          className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="用户头像" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-user text-blue-500 text-2xl"></i>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{username}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveSection('personal')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'personal'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-user-cog mr-2"></i> 个人设置
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('app')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'app'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-cog mr-2"></i> 应用设置
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('charts')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'charts'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-chart-pie mr-2"></i> 图表设置
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'notifications'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-bell mr-2"></i> 通知设置
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('privacy')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'privacy'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-shield-alt mr-2"></i> 隐私设置
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('data')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    activeSection === 'data'
                      ? isDark 
                        ? 'text-white bg-blue-900/30' 
                        : 'text-blue-700 bg-blue-50'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fa-solid fa-database mr-2"></i> 数据管理
                </button>
              </li>
              <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/about" className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}>
                  <i className="fa-solid fa-circle-info mr-2"></i> 关于我们
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}>
                  <i className="fa-solid fa-shield-halved mr-2"></i> 隐私政策
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}>
                  <i className="fa-solid fa-envelope mr-2"></i> 联系我们
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* 右侧设置内容 */}
        <motion.div
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {renderContent()}
        </motion.div>
      </div>
      
      {/* 隐藏的文件输入框 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Settings;
