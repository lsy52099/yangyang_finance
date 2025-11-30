import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area
} from 'recharts';
import { useTransaction } from '@/contexts/transactionContext';
import { useCategory } from '@/contexts/categoryContext';
import { motion } from 'framer-motion';

// 导入useTheme钩子
import { useTheme } from '@/hooks/useTheme';

// 图表类型选项
type ChartType = 'expenseByCategory' | 'incomeByCategory' | 'trend' | 'balanceTrend' | 'categoryRadar';

interface ChartsProps {
  type: ChartType;
  title: string;
}

const Charts: React.FC<ChartsProps> = ({ type, title }) => {
  const { getTransactionsByDateRange, getTransactionsByCategory, getTotalIncome, getTotalExpense } = useTransaction();
  const { getCategoriesByType, getCategoryById } = useCategory();
  const [data, setData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const { isDark } = useTheme();
  const [showLegend, setShowLegend] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [colorScheme, setColorScheme] = useState<'default' | 'pastel' | 'vibrant' | 'monochrome'>('default');
  
  // 配色方案
  const getColors = () => {
    switch (colorScheme) {
      case 'pastel':
        return { INCOME_COLOR: '#74c69d', EXPENSE_COLOR: '#f4978e', BALANCE_COLOR: '#6c8cff' };
      case 'vibrant':
        return { INCOME_COLOR: '#00c853', EXPENSE_COLOR: '#ff1744', BALANCE_COLOR: '#2979ff' };
      case 'monochrome':
        return { INCOME_COLOR: '#5b8def', EXPENSE_COLOR: '#3a66d6', BALANCE_COLOR: '#2a4fb3' };
      default:
        return { INCOME_COLOR: '#10B981', EXPENSE_COLOR: '#EF4444', BALANCE_COLOR: '#3B82F6' };
    }
  };
  const { INCOME_COLOR, EXPENSE_COLOR, BALANCE_COLOR } = getColors();

  // 加载设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.showChartLegend !== undefined) setShowLegend(!!s.showChartLegend);
        if (s.showChartLabels !== undefined) setShowLabels(!!s.showChartLabels);
        if (s.chartColorScheme) setColorScheme(s.chartColorScheme);
      }
    } catch {}
  }, []);
  
  // 生成图表数据
  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    
    // 设置时间范围
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const transactions = getTransactionsByDateRange(startDate, now);
    
    if (type === 'expenseByCategory' || type === 'incomeByCategory') {
      // 按分类统计收支
      const targetType = type === 'expenseByCategory' ? 'expense' : 'income';
      const categories = getCategoriesByType(targetType);
      
      const categoryData = categories.map(category => {
        const categoryTransactions = transactions.filter(
          tx => tx.categoryId === category.id && tx.type === targetType
        );
        const totalAmount = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        return {
          name: category.name,
          value: totalAmount,
          color: category.color,
        };
      }).filter(item => item.value > 0); // 只显示有数据的分类
      
      setData(categoryData);
    } else if (type === 'trend') {
      // 生成收支趋势数据
      let trendData: any[] = [];
      
      // 根据时间范围生成相应的日期点
      if (timeRange === 'week') {
        // 近7天每天的数据
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const dayTransactions = transactions.filter(
            tx => new Date(tx.date).toDateString() === date.toDateString()
          );
          
          trendData.push({
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            income: getTotalIncome(dayTransactions),
            expense: getTotalExpense(dayTransactions),
          });
        }
      } else if (timeRange === 'month') {
        // 本月每天的数据
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), i);
          
          // 如果日期在未来，则跳过
          if (date > now) continue;
          
          const dayTransactions = transactions.filter(
            tx => new Date(tx.date).toDateString() === date.toDateString()
          );
          
          trendData.push({
            date: `${i}日`,
            income: getTotalIncome(dayTransactions),
            expense: getTotalExpense(dayTransactions),
          });
        }
      } else if (timeRange === 'year') {
        // 本年每月的数据
        for (let i = 0; i <= now.getMonth(); i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 0);
          
          const monthTransactions = getTransactionsByDateRange(monthStart, monthEnd);
          
          trendData.push({
            date: `${i + 1}月`,
            income: getTotalIncome(monthTransactions),
            expense: getTotalExpense(monthTransactions),
          });
        }
      }
      
      setData(trendData);
    } else if (type === 'balanceTrend') {
      // 生成余额趋势数据
      let balanceData: any[] = [];
      let cumulativeBalance = 0;
      
      // 按日期排序交易记录
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      if (timeRange === 'week') {
        // 近7天每天的余额
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const dayTransactions = sortedTransactions.filter(
            tx => new Date(tx.date).toDateString() === date.toDateString()
          );
          
          // 计算当日余额
          const dayIncome = getTotalIncome(dayTransactions);
          const dayExpense = getTotalExpense(dayTransactions);
          cumulativeBalance += dayIncome - dayExpense;
          
          balanceData.push({
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            balance: cumulativeBalance,
          });
        }
      } else if (timeRange === 'month') {
        // 本月每天的余额
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), i);
          
          // 如果日期在未来，则跳过
          if (date > now) continue;
          
          const dayTransactions = sortedTransactions.filter(
            tx => new Date(tx.date).toDateString() === date.toDateString()
          );
          
          // 计算当日余额
          const dayIncome = getTotalIncome(dayTransactions);
          const dayExpense = getTotalExpense(dayTransactions);
          cumulativeBalance += dayIncome - dayExpense;
          
          balanceData.push({
            date: `${i}日`,
            balance: cumulativeBalance,
          });
        }
      } else if (timeRange === 'year') {
        // 本年每月的余额
        for (let i = 0; i <= now.getMonth(); i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 0);
          
          const monthTransactions = getTransactionsByDateRange(monthStart, monthEnd);
          
          // 计算当月余额
          const monthIncome = getTotalIncome(monthTransactions);
          const monthExpense = getTotalExpense(monthTransactions);
          cumulativeBalance += monthIncome - monthExpense;
          
          balanceData.push({
            date: `${i + 1}月`,
            balance: cumulativeBalance,
          });
        }
      }
      
      setData(balanceData);
    } else if (type === 'categoryRadar') {
      // 生成分类雷达图数据
      const expenseCategories = getCategoriesByType('expense');
      
      const radarData = expenseCategories.map(category => {
        const categoryTransactions = transactions.filter(
          tx => tx.categoryId === category.id && tx.type === 'expense'
        );
        const totalAmount = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        return {
          category: category.name,
          value: totalAmount,
          fullMark: Math.max(...transactions.map(t => t.amount)) * 2, // 设置最大值
        };
      }).filter(item => item.value > 0); // 只显示有数据的分类
      
      setData(radarData);
    }
  }, [type, timeRange, getTransactionsByDateRange, getTransactionsByCategory, getTotalIncome, getTotalExpense, getCategoriesByType, getCategoryById]);
  
  // 格式化金额
  const formatAmount = (value: number) => {
    return `¥${value.toFixed(2)}`;
  };
  
  // 渲染图表
  const renderChart = () => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
            <i className="fa-solid fa-chart-simple text-2xl"></i>
          </div>
          <p className="text-lg">暂无数据</p>
          <p className="text-sm mt-1">添加一些交易记录后查看分析数据</p>
        </div>
      );
    }
    
    // 自定义提示框样式
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className={`p-3 rounded-lg shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <p className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="flex items-center" style={{ color: entry.color }}>
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                {entry.name}: {formatAmount(entry.value)}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
    
    if (type === 'expenseByCategory' || type === 'incomeByCategory') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              minAngle={4}
              labelLine={false}
              label={showLabels && (typeof window === 'undefined' ? true : window.innerWidth >= 768)}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [formatAmount(value as number), '金额']} content={<CustomTooltip />} />
            {showLegend && <Legend verticalAlign="bottom" height={36} />}
          </PieChart>
        </ResponsiveContainer>
      );
    } else if (type === 'trend') {
      if (chartType === 'bar') {
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#f0f0f0"} />
              <XAxis dataKey="date" stroke={isDark ? "#aaa" : "#666"} />
              <YAxis stroke={isDark ? "#aaa" : "#666"} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar dataKey="income" fill={INCOME_COLOR} name="收入" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="expense" fill={EXPENSE_COLOR} name="支出" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (chartType === 'line') {
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#f0f0f0"} />
              <XAxis dataKey="date" stroke={isDark ? "#aaa" : "#666"} />
              <YAxis stroke={isDark ? "#aaa" : "#666"} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke={INCOME_COLOR} 
                name="收入" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke={EXPENSE_COLOR} 
                name="支出" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      } else { // area chart
        return (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#f0f0f0"} />
              <XAxis dataKey="date" stroke={isDark ? "#aaa" : "#666"} />
              <YAxis stroke={isDark ? "#aaa" : "#666"} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1"
                stroke={INCOME_COLOR} 
                fill={INCOME_COLOR} 
                fillOpacity={0.2} 
                name="收入" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stackId="2"
                stroke={EXPENSE_COLOR} 
                fill={EXPENSE_COLOR} 
                fillOpacity={0.2} 
                name="支出" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      }
    } else if (type === 'balanceTrend') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#f0f0f0"} />
            <XAxis dataKey="date" stroke={isDark ? "#aaa" : "#666"} />
            <YAxis stroke={isDark ? "#aaa" : "#666"} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke={BALANCE_COLOR} 
              name="余额" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (type === 'categoryRadar') {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart outerRadius={90} data={data}>
            <PolarGrid stroke={isDark ? "#444" : "#ddd"} />
            <PolarAngleAxis dataKey="category" stroke={isDark ? "#aaa" : "#666"} />
            <PolarRadiusAxis stroke={isDark ? "#aaa" : "#666"} />
            <Radar
              name="支出"
              dataKey="value"
              stroke={EXPENSE_COLOR}
              fill={EXPENSE_COLOR}
              fillOpacity={0.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };
  
  return (
    <motion.div 
      className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-bold mb-3 md:mb-0 flex items-center">
            {type === 'expenseByCategory' && <i className="fa-solid fa-chart-pie text-red-500 mr-2"></i>}
            {type === 'incomeByCategory' && <i className="fa-solid fa-chart-pie text-green-500 mr-2"></i>}
            {type === 'trend' && <i className="fa-solid fa-chart-line text-blue-500 mr-2"></i>}
            {type === 'balanceTrend' && <i className="fa-solid fa-chart-area text-indigo-500 mr-2"></i>}
            {type === 'categoryRadar' && <i className="fa-solid fa-bullseye text-purple-500 mr-2"></i>}
            {title}
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* 时间范围选择器 */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
            >
              <option value="week">近7天</option>
              <option value="month">本月</option>
              <option value="year">本年</option>
            </select>
            
            {/* 图表类型切换器（仅在趋势图中显示） */}
            {type === 'trend' && (
              <div className={`flex p-1 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    chartType === 'bar'
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  aria-label="柱状图"
                >
                  <i className="fa-solid fa-chart-bar"></i>
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    chartType === 'line'
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  aria-label="折线图"
                >
                  <i className="fa-solid fa-chart-line"></i>
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    chartType === 'area'
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  aria-label="面积图"
                >
                  <i className="fa-solid fa-chart-area"></i>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 图表容器 */}
        <div className="mt-2">
          {renderChart()}
        </div>
      </div>
    </motion.div>
  );
};

export default Charts;
