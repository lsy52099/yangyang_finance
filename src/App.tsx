import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Records from "@/pages/Records";
import Budget from "@/pages/Budget";
import Categories from "@/pages/Categories";
import Navbar from "@/components/Navbar";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
  import Contact from "@/pages/Contact";
  import Settings from "@/pages/Settings";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { AuthContext } from '@/contexts/authContext';
import { TransactionProvider } from '@/contexts/transactionContext';
import { CategoryProvider } from '@/contexts/categoryContext';
import { BudgetProvider } from '@/contexts/budgetContext';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // 保存认证状态到localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <TransactionProvider>
        <CategoryProvider>
          <BudgetProvider>
            {/* 非登录页面显示导航栏 */}
            {isAuthenticated && <Navbar />}
            
            <div className={`min-h-screen flex flex-col ${isAuthenticated ? '' : 'pt-0'}`}>
              <div className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/records" element={
                    <ProtectedRoute>
                      <Records />
                    </ProtectedRoute>
                  } />
                  <Route path="/budget" element={
                    <ProtectedRoute>
                      <Budget />
                    </ProtectedRoute>
                  } />
                  <Route path="/categories" element={
                    <ProtectedRoute>
                      <Categories />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  } />
                  <Route path="/privacy" element={
                    <ProtectedRoute>
                      <Privacy />
                    </ProtectedRoute>
                  } />
                  <Route path="/contact" element={
                    <ProtectedRoute>
                      <Contact />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={
                    <div className="text-center text-xl">页面不存在</div>
                  } />
                </Routes>
              </div>
              
              {/* 显示页脚 */}
              <Footer />
            </div>
          </BudgetProvider>
        </CategoryProvider>
      </TransactionProvider>
    </AuthContext.Provider>
  );
}

