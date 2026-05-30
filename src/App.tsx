import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Onboarding from "./components/Onboarding";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";
import MonthlySummary from "./pages/MonthlySummary";

function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("onboarded")
  );

  if (isLogin) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d]">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthly-summary"
          element={
            <ProtectedRoute>
              <MonthlySummary />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
