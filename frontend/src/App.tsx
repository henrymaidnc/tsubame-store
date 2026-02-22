import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Revenue from "./pages/Revenue";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Materials from "./pages/Materials";
// import Analytics from "./pages/Analytics";
import Distributors from "./pages/Distributors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  const handleLogin = (userRole: string) => setRole(userRole);
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setRole(null);
  };

  // Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setBooting(false);
      return;
    }
    authAPI
      .getCurrentUser()
      .then((user) => setRole(user.role))
      .catch(() => {
        localStorage.removeItem("access_token");
        setRole(null);
      })
      .finally(() => setBooting(false));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {booting ? (
              <Route path="/admin" element={<div className="p-6 text-sm text-muted-foreground">Loading…</div>} />
            ) : !role ? (
              <Route path="/admin" element={<Navigate to="/login" replace />} />
            ) : (
              <Route path="/admin" element={<AppLayout onLogout={handleLogout} role={role} />}>
                <Route path="/admin" element={<Navigate to="/admin/revenue" replace />} />
                <Route path="/admin/revenue" element={<Revenue />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<Product />} />
                <Route path="/admin/materials" element={<Materials />} />
                {/* <Route path="/admin/analytics" element={<Analytics />} /> */}
                <Route path="/admin/distributors" element={<Distributors />} />
              </Route>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
